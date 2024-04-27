import { AddPlayerController } from "./add-player-controller"
import { HttpRequest, Validation } from "./add-player-controller-protocols"

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

interface SutTypes {
	sut: AddPlayerController
	validationStub: Validation
}

const makeSut = (): SutTypes => {
	const validationStub = makeValidation()
	const sut = new AddPlayerController(validationStub)
	return {
		sut,
		validationStub
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
})
