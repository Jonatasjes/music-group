import { AccessDeniedError } from "../errors"
import { forbidden, ok, serverError } from "../helpers/http/http-helper"
import { AuthMiddleware } from "./auth-middleware"
import { AccountModel, HttpRequest, LoadAccountByToken } from "./auth-middleware-protocols"

const makeFakeAccount = (): AccountModel => ({
	id: "valid_id",
	name: "valid_name",
	email: "valid_email@mail.com",
	password: "hashed_password"
})

const makeFakeHttpRequest = (): HttpRequest => ({
	headers: {
		"x-access-token": "any_token"
	}
})

const makeLoadAccountByToken = () => {
	class LoadAccountByTokenStub implements LoadAccountByToken {
		async load(accessToken: string, role?: string): Promise<AccountModel> {
			return new Promise((resolve) => resolve(makeFakeAccount()))
		}
	}
	return new LoadAccountByTokenStub()
}

interface SutTypes {
	sut: AuthMiddleware
	loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
	const loadAccountByTokenStub = makeLoadAccountByToken()
	const sut = new AuthMiddleware(loadAccountByTokenStub, role)

	return {
		sut,
		loadAccountByTokenStub
	}
}

describe("Auth Middleware", () => {
	test("Should return 403 if no x-access-token exists in headers", async () => {
		const { sut } = makeSut()
		const httpResponse = await sut.handle({})
		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
	})

	test("Should call LoadAccountByToken with correct accessToken", async () => {
		const role = "any_role"
		const { sut, loadAccountByTokenStub } = makeSut(role)
		const loadSpy = jest.spyOn(loadAccountByTokenStub, "load")
		await sut.handle(makeFakeHttpRequest())
		expect(loadSpy).toHaveBeenCalledWith("any_token", role)
	})

	test("Should return 403 if LoadAccountByToken returns null", async () => {
		const { sut, loadAccountByTokenStub } = makeSut()
		jest.spyOn(loadAccountByTokenStub, "load").mockReturnValueOnce(new Promise((resolve) => resolve(null)))
		const httpResponse = await sut.handle({})
		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
	})

	test("Should return 200 if LoadAccountByToken returns an account", async () => {
		const { sut } = makeSut()
		const httpResponse = await sut.handle(makeFakeHttpRequest())
		expect(httpResponse).toEqual(
			ok({
				accountId: "valid_id"
			})
		)
	})

	test("Should return 500 if LoadAccountByToken throws", async () => {
		const { sut, loadAccountByTokenStub } = makeSut()
		jest
			.spyOn(loadAccountByTokenStub, "load")
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
		const httpResponse = await sut.handle(makeFakeHttpRequest())
		expect(httpResponse).toEqual(serverError(new Error()))
	})
})
