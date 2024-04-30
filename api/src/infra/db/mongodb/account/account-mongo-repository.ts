import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository"
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/account/load_account-by-email-repository"
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/account/update-access-token-repository"
import { LoadAccountByTokenRepository } from "../../../../data/usecases/load-account-by-token/db-load-account-by-token-protocols"
import { AccountModel } from "../../../../domain/models/account"
import { AddAccountModel } from "../../../../domain/usecases/add-account"
import { MongoHelper } from "../helpers/mongo-helper"

export class AccountMongoRepository // eslint-disable-next-line indent
	implements
		AddAccountRepository,
		LoadAccountByEmailRepository,
		UpdateAccessTokenRepository,
		LoadAccountByTokenRepository
{
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

	async updateAccessToken(id: string, token: string): Promise<void> {
		const accountCollection = await MongoHelper.getCollection("accounts")

		await accountCollection.updateOne(
			{ _id: MongoHelper.mongoId(id) },
			{
				$set: {
					accessToken: token
				}
			}
		)
	}

	async loadByToken(token: string, role?: string): Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection("accounts")
		const account = await accountCollection.findOne({ accessToken: token, role })

		if (account) {
			const { _id, name, password } = account
			return account && Object.assign({}, { name, password, email: account.email }, { id: _id.toString() })
		}
		return null
	}
}
