export interface AddPlayerModel {
	name: string
	instrument: string[]
}

export interface AddPlayer {
	add(data: AddPlayerModel): Promise<void>
}
