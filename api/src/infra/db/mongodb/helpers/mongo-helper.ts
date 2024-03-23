import { Collection, ConnectOptions, MongoClient } from "mongodb"

export const MongoHelper = {
	client: null as MongoClient,
	async connect(uri: string): Promise<void> {
		this.client = await MongoClient.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		} as ConnectOptions)
	},
	async disconnect() {
		await this.client.close()
	},

	getCollection(name: string): Collection {
		return this.client.db().collection(name)
	}
}
