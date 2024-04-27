import { AddPlayerModel } from "../../../usecases/add-player/db-add-player-protocols"

export interface AddPlayerRepository {
	add(playerData: AddPlayerModel): Promise<void>
}
