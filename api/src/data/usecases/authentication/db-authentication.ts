import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication"
import { HashComparer } from "../../protocols/criptography/hash-comparer"
import { Encrypter } from "../../protocols/criptography/encrypter"
import { LoadAccountByEmailRepository } from "../../protocols/db/load_account-by-email-repository"
import { UpdateAccessTokenRepository } from "../../protocols/db/update-access-token-repository"

export class DbAuthentication implements Authentication {
	private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
	private readonly hashCompare: HashComparer
	private readonly encrypter: Encrypter
	private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
	constructor(
		loadAccountByEmailRepository: LoadAccountByEmailRepository,
		hashCompare: HashComparer,
		encrypter: Encrypter,
		updateAccessTokenRepository: UpdateAccessTokenRepository
	) {
		this.loadAccountByEmailRepository = loadAccountByEmailRepository
		this.hashCompare = hashCompare
		this.encrypter = encrypter
		this.updateAccessTokenRepository = updateAccessTokenRepository
	}
	async auth(authentication: AuthenticationModel): Promise<string> {
		const account = await this.loadAccountByEmailRepository.load(authentication.email)
		if (account) {
			const isValid = await this.hashCompare.compare(authentication.password, account.password)
			if (isValid) {
				const accessToken = await this.encrypter.encrypt(account.id)
				this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
				return accessToken
			}
		}
		return null
	}
}
