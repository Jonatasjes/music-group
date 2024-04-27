import { AddPlayer, AddPlayerModel, AddPlayerRepository } from "./db-add-player-protocols"

export class DbAddPlayer implements AddPlayer {
	constructor(private readonly addPlayerRepository: AddPlayerRepository) {
		this.addPlayerRepository = addPlayerRepository
	}
	async add(data: AddPlayerModel): Promise<void> {
		await this.addPlayerRepository.add(data)
	}
}
