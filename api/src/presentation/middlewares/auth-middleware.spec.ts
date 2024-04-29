import { AccessDeniedError } from "../errors"
import { forbidden } from "../helpers/http/http-helper"
import { AuthMiddleware } from "./auth-middleware"

interface SutTypes {
	sut: AuthMiddleware
}

const makeSut = (): SutTypes => {
	const sut = new AuthMiddleware()

	return {
		sut
	}
}

describe("Auth Middleware", () => {
	test("Should return 403 if no x-access-token exists in headers", async () => {
		const { sut } = makeSut()
		const HttpResponse = await sut.handle({})
		expect(HttpResponse).toEqual(forbidden(new AccessDeniedError()))
	})
})
