import { AddPlayerController } from "../../../../../presentation/controllers/player/add-player/add-player-controller"
import { Controller } from "../../../../../presentation/protocols"
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator-factory"
import { makeDbAddPlayer } from "../../../usecases/player/add-player/db-add-player-factory"
import { makeAddPlayerValidation } from "./add-player-validation-factory"

export const makeAddPlayerController = (): Controller => {
	const addPlayerController = new AddPlayerController(makeAddPlayerValidation(), makeDbAddPlayer())
	return makeLogControllerDecorator(addPlayerController)
}
