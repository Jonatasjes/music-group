import { Validation } from "../../../../../presentation/protocols"
import { RequiredFieldValidation, ValidationComposite } from "../../../../../validation/validators"
import { makeAddPlayerValidation } from "./add-player-validation-factory"

jest.mock("../../../../../validation/validators/validation-composite")

describe("AddPlayerValidation Factory", () => {
	test("Should call ValidationComposite with all validations", () => {
		makeAddPlayerValidation()
		const validations: Validation[] = []

		for (const field of ["name", "instrument"]) {
			validations.push(new RequiredFieldValidation(field))
		}

		expect(ValidationComposite).toHaveBeenCalledWith(validations)
	})
})
