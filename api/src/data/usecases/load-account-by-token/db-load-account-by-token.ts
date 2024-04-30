import {
	AccountModel,
	Decrypter,
	LoadAccountByToken,
	LoadAccountByTokenRepository
} from "./db-load-account-by-token-protocols"

export class DbLoadAccountByToken implements LoadAccountByToken {
	constructor(
		private readonly decrypter: Decrypter,
		private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
	) {
		this.decrypter = decrypter
		this.loadAccountByTokenRepository = loadAccountByTokenRepository
	}
	async load(accessToken: string, role?: string): Promise<AccountModel> {
		const token = await this.decrypter.decrypt(accessToken)
		if (token) {
			await this.loadAccountByTokenRepository.loadByToken(token, role)
		}
		return null
	}
}
