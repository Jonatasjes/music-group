import { badRequest, noContent, serverError } from "../../../helpers/http/http-helper"
import { AddPlayerController } from "./add-player-controller"
import { AddPlayer, AddPlayerModel, HttpRequest, Validation } from "./add-player-controller-protocols"

const makeFakeHttpRequest = (): HttpRequest => ({
	body: {
		name: "any_name",
		instrument: ["any_instrument"]
	}
})

const makeValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate(input: any): Error {
			return null
		}
	}
	return new ValidationStub()
}

const makeAddPlayer = (): AddPlayer => {
	class AddPlayerStub implements AddPlayer {
		async add(data: AddPlayerModel): Promise<void> {
			return new Promise((resolve) => resolve())
		}
	}
	return new AddPlayerStub()
}

interface SutTypes {
	sut: AddPlayerController
	validationStub: Validation
	addPlayerStub: AddPlayer
}

const makeSut = (): SutTypes => {
	const validationStub = makeValidation()
	const addPlayerStub = makeAddPlayer()
	const sut = new AddPlayerController(validationStub, addPlayerStub)
	return {
		sut,
		validationStub,
		addPlayerStub
	}
}

describe("AddPlayer Controller", () => {
	test("Should call Validation with correct values", async () => {
		const { sut, validationStub } = makeSut()
		const validateSpy = jest.spyOn(validationStub, "validate")
		const httpRequest = makeFakeHttpRequest()
		await sut.handle(httpRequest)
		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
	})

	test("Should return 400 if Validation fails", async () => {
		const { sut, validationStub } = makeSut()
		jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error())
		const HttpResponse = await sut.handle(makeFakeHttpRequest())
		expect(HttpResponse).toEqual(badRequest(new Error()))
	})

	test("Should call AddPlayer with correct values", async () => {
		const { sut, addPlayerStub } = makeSut()
		const addSpy = jest.spyOn(addPlayerStub, "add")
		const httpRequest = makeFakeHttpRequest()
		await sut.handle(httpRequest)
		expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
	})

	test("Should return 500 if AddPlayer throws", async () => {
		const { sut, addPlayerStub } = makeSut()
		jest.spyOn(addPlayerStub, "add").mockImplementationOnce(() => {
			throw new Error()
		})
		const HttpResponse = await sut.handle(makeFakeHttpRequest())
		expect(HttpResponse).toEqual(serverError(new Error()))
	})

	test("Should return 204 on success", async () => {
		const { sut } = makeSut()
		const HttpResponse = await sut.handle(makeFakeHttpRequest())
		expect(HttpResponse).toEqual(noContent())
	})
})
