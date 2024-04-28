import { Collection } from "mongodb"
import { MongoHelper } from "../helpers/mongo-helper"
import { AddPlayerMongoRepository } from "./player-mongo-repository"
import { AddPlayerModel } from "../../../../domain/usecases/add-player"

const makeAddPlayerModel = (): AddPlayerModel => ({
	name: "any_name",
	instrument: ["any_instrument"]
})

let playerCollection: Collection

describe("Player Mongo Repository", () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL)
	})

	afterAll(async () => {
		await MongoHelper.disconnect()
	})

	beforeEach(async () => {
		playerCollection = await MongoHelper.getCollection("players")
		await playerCollection.deleteMany({})
	})

	const makeSut = (): AddPlayerMongoRepository => {
		return new AddPlayerMongoRepository()
	}

	test("Should add a player on success", async () => {
		const sut = makeSut()
		await sut.add(makeAddPlayerModel())
		const player = await playerCollection.findOne({ name: "any_name" })
		expect(player).toBeTruthy()
	})
})
