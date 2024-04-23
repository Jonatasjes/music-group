import bcrypt from "bcrypt"
import { Hasher } from "../../../data/protocols/criptography/hasher"
import { HashComparer } from "../../../data/protocols/criptography/hash-comparer"

export class BcryptAdapter implements Hasher, HashComparer {
	constructor(private readonly salt: number) {
		this.salt = salt
	}
	async hash(value: string): Promise<string> {
		const hash = await bcrypt.hash(value, this.salt)
		return hash
	}

	async compare(password: string, hash: string): Promise<boolean> {
		const isValid = await bcrypt.compare(password, hash)
		return isValid
	}
}
