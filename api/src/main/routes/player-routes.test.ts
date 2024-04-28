import request from "supertest"
import app from "../config/app"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"
import { Collection } from "mongodb"

let playerCollection: Collection

describe("Player Routes", () => {
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

	describe("POST /players", () => {
		test("Should return 204 on add player success", async () => {
			await request(app)
				.post("/api/players")
				.send({
					name: "Jonatas",
					instrument: ["contrabaixo", "teclado", "bateria"]
				})
				.expect(204)
		})
	})
})
