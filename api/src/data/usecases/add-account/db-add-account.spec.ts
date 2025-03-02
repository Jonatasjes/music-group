import { DbAddAccount } from "./db-add-account"
import {
	AccountModel,
	AddAccountModel,
	Hasher,
	AddAccountRepository,
	LoadAccountByEmailRepository
} from "./db-add-account-protocols"

const makeHasher = (): Hasher => {
	class HasherStub implements Hasher {
		async hash(value: string): Promise<string> {
			return new Promise((resolve) => resolve("hashed_password"))
		}
	}

	return new HasherStub()
}

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
		async loadByEmail(email: string): Promise<AccountModel> {
			return new Promise((resolve) => resolve(null))
		}
	}

	return new LoadAccountByEmailRepositoryStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
	class AddAccountRepositoryStub implements AddAccountRepository {
		async add(accountData: AddAccountModel): Promise<AccountModel> {
			return new Promise((resolve) => resolve(makeFakeAccount()))
		}
	}

	return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
	id: "valid_id",
	name: "valid_name",
	email: "valid_email@mail.com",
	password: "hashed_password"
})

const makeFakeAccountData = (): AddAccountModel => ({
	name: "valid_name",
	email: "valid_email@mail.com",
	password: "valid_password"
})

interface SutTypes {
	sut: DbAddAccount
	hasherStub: Hasher
	addAccountRepositoryStub: AddAccountRepository
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
	const hasherStub = makeHasher()
	const addAccountRepositoryStub = makeAddAccountRepository()
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
	const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
	return {
		hasherStub,
		sut,
		addAccountRepositoryStub,
		loadAccountByEmailRepositoryStub
	}
}

describe("DbAddAccount Usecase", () => {
	test("Should call Hasher with correct password", async () => {
		const { sut, hasherStub } = makeSut()
		const hashSpy = jest.spyOn(hasherStub, "hash")
		const accountData = makeFakeAccountData()
		await sut.add(accountData)
		expect(hashSpy).toHaveBeenCalledWith("valid_password")
	})

	test("Should throw if Hasher throws", async () => {
		const { sut, hasherStub } = makeSut()
		jest.spyOn(hasherStub, "hash").mockImplementationOnce(() => {
			throw new Error()
		})

		const accountData = makeFakeAccountData()
		const promise = sut.add(accountData)
		await expect(promise).rejects.toThrow()
	})

	test("Should call AddAccountRepository with correct values", async () => {
		const { sut, addAccountRepositoryStub } = makeSut()
		const addtSpy = jest.spyOn(addAccountRepositoryStub, "add")
		const accountData = makeFakeAccountData()
		await sut.add(accountData)
		expect(addtSpy).toHaveBeenCalledWith({
			name: "valid_name",
			email: "valid_email@mail.com",
			password: "hashed_password"
		})
	})

	test("Should throw if Hasher throws", async () => {
		const { sut, addAccountRepositoryStub } = makeSut()
		jest.spyOn(addAccountRepositoryStub, "add").mockImplementationOnce(() => {
			throw new Error()
		})
		const accountData = makeFakeAccountData()
		const promise = sut.add(accountData)
		await expect(promise).rejects.toThrow()
	})

	test("Should return an account on success", async () => {
		const { sut } = makeSut()
		const accountData = makeFakeAccountData()
		const account = await sut.add(accountData)
		expect(account).toEqual(makeFakeAccount())
	})

	test("Should return null if LoadAccountByEmailRepository not returns null", async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut()
		jest
			.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
			.mockReturnValueOnce(new Promise((resolve) => resolve(makeFakeAccount())))
		const accountData = makeFakeAccountData()
		const account = await sut.add(accountData)
		expect(account).toBeNull()
	})

	test("Should call LoadAccountByEmailRepository with correct email", async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut()
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
		await await sut.add(makeFakeAccountData())
		expect(loadSpy).toHaveBeenCalledWith("valid_email@mail.com")
	})
})
