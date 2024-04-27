import { Controller, HttpRequest, HttpResponse, Validation } from "./add-player-controller-protocols"

export class AddPlayerController implements Controller {
	constructor(private readonly validation: Validation) {
		this.validation = validation
	}
	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		this.validation.validate(httpRequest.body)
		return new Promise((resolve) => resolve(null))
	}
}
