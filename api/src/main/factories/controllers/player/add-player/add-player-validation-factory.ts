import { Validation } from "../../../../../presentation/protocols"
import { RequiredFieldValidation, ValidationComposite } from "../../../../../validation/validators"

export const makeAddPlayerValidation = (): ValidationComposite => {
	const validations: Validation[] = []
	for (const field of ["name", "instrument"]) {
		validations.push(new RequiredFieldValidation(field))
	}
	return new ValidationComposite(validations)
}
