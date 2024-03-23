import request from "supertest"
import app from "../config/app"

describe("Body Parser Middleware", () => {
	test("Should parser body as json", async () => {
		app.post("/test_body_parser", (req, res) => {
			res.send({
				name: "test_name"
			})
		})
		await request(app).post("/test_body_parser").expect({
			name: "test_name"
		})
	})
})
