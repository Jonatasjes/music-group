import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository"
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/load_account-by-email-repository"
import { AccountModel } from "../../../../domain/models/account"
import { AddAccountModel } from "../../../../domain/usecases/add-account"
import { MongoHelper } from "../helpers/mongo-helper"

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
	async add(accountData: AddAccountModel): Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection("accounts")
		const result = await accountCollection.insertOne(accountData)
		return MongoHelper.map(result, accountData)
	}

	async loadByEmail(email: string): Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection("accounts")
		const account = await accountCollection.findOne({ email })

		if (account) {
			const { _id, name, password } = account
			return account && Object.assign({}, { name, password, email: account.email }, { id: _id.toString() })
		}
		return null
	}
}
