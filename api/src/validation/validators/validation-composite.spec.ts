import { MissingParamError } from "../../presentation/errors"
import { Validation } from "../../presentation/protocols"
import { ValidationComposite } from "./validation-composite"

const makeValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate(input: any): Error {
			return null
		}
	}
	return new ValidationStub()
}

interface SutTypes {
	sut: ValidationComposite
	validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
	const validationStubs = [makeValidation(), makeValidation()]
	const sut = new ValidationComposite(validationStubs)
	return {
		sut,
		validationStubs
	}
}
describe("Validation Composite", () => {
	test("Should returns an error if any vaidation fails", () => {
		const { sut, validationStubs } = makeSut()
		jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new MissingParamError("field"))
		const error = sut.validate({ field: "any_value" })
		expect(error).toEqual(new MissingParamError("field"))
	})

	test("Should not returns if vaidation succeeds", () => {
		const { sut } = makeSut()
		const error = sut.validate({ field: "any_value" })
		expect(error).toBeFalsy()
	})

	test("Should returns the first error if more then one vaidation fails", () => {
		const { sut, validationStubs } = makeSut()
		jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new Error())
		jest.spyOn(validationStubs[1], "validate").mockReturnValueOnce(new MissingParamError("field"))
		const error = sut.validate({ field: "any_value" })
		expect(error).toEqual(new Error())
	})
})
