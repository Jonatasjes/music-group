import { Collection, ConnectOptions, InsertOneResult, MongoClient } from "mongodb"

export const MongoHelper = {
	client: null as MongoClient,
	uri: null as string,
	async connect(uri: string): Promise<void> {
		this.uri = uri
		this.client = await MongoClient.connect(uri, {} as ConnectOptions)
	},
	async disconnect() {
		!this.client?.isConnected && (await this.client.close())
	},

	async getCollection(name: string): Promise<Collection> {
		if (!this.client?.isConnected) {
			await this.connect(this.uri)
		}
		return this.client.db().collection(name)
	},

	map(result: InsertOneResult<Document>, data: any): any {
		const { _id, ...dataWithoutId } = data
		return Object.assign({}, dataWithoutId, { id: result.insertedId.toString() })
	}
}
