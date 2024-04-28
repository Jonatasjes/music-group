import { DbAddPlayer } from "../../../../../data/usecases/add-player/db-add-player"
import { AddPlayer } from "../../../../../domain/usecases/add-player"
import { AddPlayerMongoRepository } from "../../../../../infra/db/mongodb/player/player-mongo-repository"

export const makeDbAddPlayer = (): AddPlayer => {
	const addPlayerMongoRepository = new AddPlayerMongoRepository()
	return new DbAddPlayer(addPlayerMongoRepository)
}
