import { Router } from "express"
import { adaptRoute } from "../adapters/express/express-route-adapter"
import { makeAddPlayerController } from "../factories/controllers/player/add-player/add-player-controller-factory"

export default (router: Router): void => {
	router.post("/players", adaptRoute(makeAddPlayerController()))
}
