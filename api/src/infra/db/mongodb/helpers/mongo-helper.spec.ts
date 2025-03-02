import { MongoHelper as sut } from "./mongo-helper"
describe("Mongo Helper", () => {
	beforeAll(async () => {
		await sut.connect(process.env.MONGO_URL)
	})

	afterAll(async () => {
		await sut.disconnect()
	})

	test("Should reconnect if mongobd is down", async () => {
		let accountCollection = await sut.getCollection("account")
		expect(accountCollection).toBeTruthy()
		await sut.disconnect()
		accountCollection = await sut.getCollection("account")
		expect(accountCollection).toBeTruthy()
	})
})
