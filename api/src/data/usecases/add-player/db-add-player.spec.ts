import { DbAddPlayer } from "./db-add-player"
import { AddPlayerModel, AddPlayerRepository } from "./db-add-player-protocols"

const makeAddPlayerModel = (): AddPlayerModel => ({
	name: "any_name",
	instrument: ["any_instrument"]
})

const makeAddPlayerRepository = (): AddPlayerRepository => {
	class AddPlayerRepositoryStub implements AddPlayerRepository {
		async add(playerData: AddPlayerModel): Promise<void> {
			return new Promise((resolve) => resolve())
		}
	}

	return new AddPlayerRepositoryStub()
}

interface SutTypes {
	sut: DbAddPlayer
	addPlayerRepositoryStub: AddPlayerRepository
}

const makeSut = (): SutTypes => {
	const addPlayerRepositoryStub = makeAddPlayerRepository()
	const sut = new DbAddPlayer(addPlayerRepositoryStub)
	return {
		sut,
		addPlayerRepositoryStub
	}
}

describe("DbAddPlayer Usecase", () => {
	test("Should call AddPlayerRepository with correct values", async () => {
		const { sut, addPlayerRepositoryStub } = makeSut()
		const addSpy = jest.spyOn(addPlayerRepositoryStub, "add")
		const playerData = makeAddPlayerModel()
		await sut.add(playerData)
		expect(addSpy).toHaveBeenCalledWith(playerData)
	})
})
