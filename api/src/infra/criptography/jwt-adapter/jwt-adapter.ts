import jwt from "jsonwebtoken"
import { Encrypter } from "../../../data/protocols/criptography/encrypter"

export class JwtAdapter implements Encrypter {
	constructor(private readonly secret: string) {
		this.secret = secret
	}
	async encrypt(id: string): Promise<string> {
		const accessToken = await jwt.sign({ id }, this.secret)
		return accessToken
	}
}
