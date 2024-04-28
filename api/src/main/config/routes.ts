import { Express, Router } from "express"
import loginRoutes from "../routes/login-routes"
import playerRoutes from "../routes/player-routes"

export default (app: Express): void => {
	const router = Router()
	app.use("/api", router)
	loginRoutes(router)
	playerRoutes(router)
}
