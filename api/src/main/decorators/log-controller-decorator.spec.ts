import { LogErrorRepository } from "../../data/protocols/db/log/log-error-repository"
import { serverError } from "../../presentation/helpers/http/http-helper"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log-controller-decorator"

interface SutTypes {
	sut: LogControllerDecorator
	controllerStub: Controller
	logErrorRepositoryStub: LogErrorRepository
}

const makeController = (): Controller => {
	class ControllerStub implements Controller {
		async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
			const httpResponse = {
				statusCode: 200,
				body: {
					id: "any_id",
					name: "any_name",
					email: "any_email@mail.com",
					password: "any_password"
				}
			}
			return new Promise((resolve) => resolve(httpResponse))
		}
	}
	return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
	class LogErrorRepositoryStub implements LogErrorRepository {
		async logError(stack: string): Promise<void> {
			return new Promise((resolve) => resolve())
		}
	}
	return new LogErrorRepositoryStub()
}

const makeFakeRequest = (): HttpRequest => ({
	body: {
		name: "any_name",
		email: "any_email@mail.com",
		password: "any_password",
		passwordConfirmation: "any_password"
	}
})

const makeSut = (): SutTypes => {
	const controllerStub = makeController()
	const logErrorRepositoryStub = makeLogErrorRepository()
	const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
	return {
		sut,
		controllerStub,
		logErrorRepositoryStub
	}
}

describe("Log Controller Decorator", () => {
	test("Should call Controller handle", async () => {
		const { sut, controllerStub } = makeSut()
		const handleSpy = jest.spyOn(controllerStub, "handle")
		const httpRequest = makeFakeRequest()
		await sut.handle(httpRequest)
		expect(handleSpy).toHaveBeenCalledWith(httpRequest)
	})

	test("Should return the same result of Controller handle", async () => {
		const { sut } = makeSut()
		const httpRequest = makeFakeRequest()
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual({
			statusCode: 200,
			body: {
				id: "any_id",
				name: "any_name",
				email: "any_email@mail.com",
				password: "any_password"
			}
		})
	})

	test("Should call the logErrorRepository with correct error if controller returns a server error", async () => {
		const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
		const fakeError = new Error()
		fakeError.stack = "any_stack"
		const error = serverError(fakeError)
		const logSpy = jest.spyOn(logErrorRepositoryStub, "logError")
		jest.spyOn(controllerStub, "handle").mockReturnValueOnce(new Promise((resolve) => resolve(error)))
		const httpRequest = makeFakeRequest()
		await sut.handle(httpRequest)
		expect(logSpy).toHaveBeenCalledWith("any_stack")
	})
})
