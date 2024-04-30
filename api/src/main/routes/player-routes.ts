import { Router } from "express"
import { adaptRoute } from "../adapters/express-route-adapter"
import { makeAddPlayerController } from "../factories/controllers/player/add-player/add-player-controller-factory"
import { makeAuthMiddleware } from "../factories/middlewares/auth-middleware-factory"
import { adaptMiddleware } from "../adapters/express-middleware-adapter"

export default (router: Router): void => {
	const adminAuth = adaptMiddleware(makeAuthMiddleware("admin"))
	router.post("/players", adminAuth, adaptRoute(makeAddPlayerController()))
}
