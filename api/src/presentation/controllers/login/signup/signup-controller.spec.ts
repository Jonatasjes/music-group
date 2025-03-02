import { SignUpController } from "./signup-controller"
import { MissingParamError, ServerError, EmailInUseError } from "../../../errors"
import {
	AccountModel,
	AddAccount,
	AddAccountModel,
	Authentication,
	AuthenticationModel,
	HttpRequest,
	Validation
} from "./signup-controller-protocols"
import { badRequest, forbidden, ok, serverError } from "../../../helpers/http/http-helper"

const makeAuthentication = (): Authentication => {
	class AuthenticationStub implements Authentication {
		async auth(authentication: AuthenticationModel): Promise<string> {
			return new Promise((resolve) => resolve("any_token"))
		}
	}

	return new AuthenticationStub()
}

const makeAddAccount = (): AddAccount => {
	class AddAccountStub implements AddAccount {
		async add(account: AddAccountModel): Promise<AccountModel> {
			const fakeAccount = makeFakeAccount()

			return new Promise((resolve) => resolve(fakeAccount))
		}
	}
	return new AddAccountStub()
}

const makeValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate(input: any): Error {
			return null
		}
	}
	return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
	id: "valid_id",
	name: "valid_name",
	email: "valid_email@mail.com",
	password: "valid_password"
})

const makeFakeRequest = (): HttpRequest => ({
	body: {
		name: "any_name",
		email: "any_email@mail.com",
		password: "any_password",
		passwordConfirmation: "any_password"
	}
})

interface SutTypes {
	sut: SignUpController
	addAccountStub: AddAccount
	validationStub: Validation
	authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
	const addAccountStub = makeAddAccount()
	const validationStub = makeValidation()
	const authenticationStub = makeAuthentication()
	const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
	return {
		sut,
		addAccountStub,
		validationStub,
		authenticationStub
	}
}

describe("SignUp Controller", () => {
	test("Should return 500 if AddAccount throws", async () => {
		const { sut, addAccountStub } = makeSut()
		jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
			return new Promise((resolve, reject) => reject(new Error()))
		})

		const httpRequest = makeFakeRequest()

		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(serverError(new ServerError()))
	})

	test("Should Call AddAccount with correct values", async () => {
		const { sut, addAccountStub } = makeSut()
		const addSpy = jest.spyOn(addAccountStub, "add")
		const httpRequest = makeFakeRequest()

		await sut.handle(httpRequest)
		expect(addSpy).toHaveBeenCalledWith({
			name: "any_name",
			email: "any_email@mail.com",
			password: "any_password"
		})
	})

	test("Should return 403 if AddAccount returns null", async () => {
		const { sut, addAccountStub } = makeSut()
		jest.spyOn(addAccountStub, "add").mockReturnValueOnce(new Promise((resolve) => resolve(null)))
		const httpRequest = makeFakeRequest()
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
	})

	test("Should return 200 if valid data is provided", async () => {
		const { sut } = makeSut()
		const httpRequest = makeFakeRequest()

		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(ok({ accessToken: "any_token" }))
	})

	test("Should Call Validation with correct values", async () => {
		const { sut, validationStub } = makeSut()
		const validateSpy = jest.spyOn(validationStub, "validate")
		const httpRequest = makeFakeRequest()

		await sut.handle(httpRequest)
		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
	})

	test("Should return 400 if validation returns an error", async () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("any_field"))
		const httpRequest = makeFakeRequest()

		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")))
	})

	test("Should call Authentication with corrects values", async () => {
		const { sut, authenticationStub } = makeSut()
		const authSpy = jest.spyOn(authenticationStub, "auth")
		const httpRequest = makeFakeRequest()
		await sut.handle(httpRequest)
		expect(authSpy).toHaveBeenCalledWith({ email: "any_email@mail.com", password: "any_password" })
	})

	test("Should returns 500 if Authentication throws", async () => {
		const { sut, authenticationStub } = makeSut()
		jest.spyOn(authenticationStub, "auth").mockImplementationOnce(() => {
			throw new Error()
		})
		const httpRequest = makeFakeRequest()
		const HttpResponse = await sut.handle(httpRequest)
		expect(HttpResponse).toEqual(serverError(new Error()))
	})
})
