import { SignUpController } from "../../../../../presentation/controllers/login/signup/signup-controller"
import { Controller } from "../../../../../presentation/protocols"
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator-factory"
import { makeDbAddAccount } from "../../../usecases/account/add-account/db-add-account-factory"
import { makeDbAuthentication } from "../../../usecases/authentication/db-authentication-factory"
import { makeSignupValidation } from "./signup-validation-factory"

export const makeSignupController = (): Controller => {
	const signUpController = new SignUpController(
		makeDbAddAccount(),
		makeSignupValidation(),
		makeDbAuthentication()
	)
	return makeLogControllerDecorator(signUpController)
}
