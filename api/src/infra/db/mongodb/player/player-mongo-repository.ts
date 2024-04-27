import { AddPlayerRepository } from "../../../../data/protocols/db/player/add-player-repository"
import { AddPlayerModel } from "../../../../domain/usecases/add-player"
import { MongoHelper } from "../helpers/mongo-helper"

export class PlayerMongoRepository implements AddPlayerRepository {
	async add(playerData: AddPlayerModel): Promise<void> {
		const playerCollection = await MongoHelper.getCollection("players")
		await playerCollection.insertOne(playerData)
	}
}
