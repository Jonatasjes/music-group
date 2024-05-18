import request from "supertest"
import app from "../config/app"
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"
import { Collection } from "mongodb"
import { sign } from "jsonwebtoken"
import env from "../config/env"

let playerCollection: Collection
let accountCollection: Collection

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

		accountCollection = await MongoHelper.getCollection("accounts")
		await accountCollection.deleteMany({})
	})

	describe("POST /players", () => {
		test("Should return 403 on add player without accessToken", async () => {
			await request(app)
				.post("/api/players")
				.send({
					name: "Jonatas",
					instrument: ["contrabaixo", "teclado", "bateria"]
				})
				.expect(403)
		})

		test("Should return 204 on add player with valid accessToken", async () => {
			const res = await accountCollection.insertOne({
				name: "jonatas",
				email: "jonatas@mail.com",
				password: "123",
				role: "admin"
			})
			const id = res.insertedId.toString()
			const accessToken = sign({ id }, env.jwtSecret)

			await accountCollection.updateOne(
				{
					_id: res.insertedId
				},
				{
					$set: {
						accessToken
					}
				}
			)

			await request(app)
				.post("/api/players")
				.set("x-access-token", accessToken)
				.send({
					name: "Jonatas",
					instrument: ["contrabaixo", "teclado", "bateria"]
				})
				.expect(204)
		})
	})
})
