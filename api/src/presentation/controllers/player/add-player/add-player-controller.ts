import { badRequest } from "../../../helpers/http/http-helper"
import {
	AddPlayer,
	Controller,
	HttpRequest,
	HttpResponse,
	Validation
} from "./add-player-controller-protocols"

export class AddPlayerController implements Controller {
	constructor(
		private readonly validation: Validation,
		private readonly AddPlayer: AddPlayer
	) {
		this.validation = validation
		this.AddPlayer = AddPlayer
	}
	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const error = this.validation.validate(httpRequest.body)
		if (error) {
			return badRequest(error)
		}

		const { name, instrument } = httpRequest.body
		await this.AddPlayer.add({
			name,
			instrument
		})

		return null
	}
}
