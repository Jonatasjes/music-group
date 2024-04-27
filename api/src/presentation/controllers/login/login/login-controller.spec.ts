import { MissingParamError } from "../../../errors"
import { badRequest, ok, serverError, unauthorized } from "../../../helpers/http/http-helper"
import { LoginController } from "./login-controller"
import { Authentication, AuthenticationModel, HttpRequest, Validation } from "./login-controller-protocols"

const makeAuthentication = (): Authentication => {
	class AuthenticationStub implements Authentication {
		async auth(authentication: AuthenticationModel): Promise<string> {
			return new Promise((resolve) => resolve("any_token"))
		}
	}

	return new AuthenticationStub()
}

const makeValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate(input: any): Error {
			return null
		}
	}
	return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => ({
	body: {
		email: "any_email@mail.com",
		password: "any_password"
	}
})

interface SutTypes {
	sut: LoginController
	authenticationStub: Authentication
	validationStub: Validation
}

const makeSut = (): SutTypes => {
	const authenticationStub = makeAuthentication()
	const validationStub = makeValidation()
	const sut = new LoginController(validationStub, authenticationStub)
	return {
		sut,
		validationStub,
		authenticationStub
	}
}

describe("Login Controller", () => {
	test("Should call Authentication with corrects values", async () => {
		const { sut, authenticationStub } = makeSut()
		const authSpy = jest.spyOn(authenticationStub, "auth")
		const httpRequest = makeFakeRequest()
		await sut.handle(httpRequest)
		expect(authSpy).toHaveBeenCalledWith({ email: "any_email@mail.com", password: "any_password" })
	})

	test("Should returns 401 if invalid credations are provided", async () => {
		const { sut, authenticationStub } = makeSut()
		jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(new Promise((resolve) => resolve(null)))
		const httpRequest = makeFakeRequest()
		const HttpResponse = await sut.handle(httpRequest)
		expect(HttpResponse).toEqual(unauthorized())
	})

	test("Should returns 500 if Authentication throws", async () => {
		const { sut, authenticationStub } = makeSut()
		jest
			.spyOn(authenticationStub, "auth")
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
		const httpRequest = makeFakeRequest()
		const HttpResponse = await sut.handle(httpRequest)
		expect(HttpResponse).toEqual(serverError(new Error()))
	})

	test("Should returns 200 if valid credations are provided", async () => {
		const { sut } = makeSut()
		const httpRequest = makeFakeRequest()
		const HttpResponse = await sut.handle(httpRequest)
		expect(HttpResponse).toEqual(ok({ accessToken: "any_token" }))
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
})
