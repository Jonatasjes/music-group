import type { Config } from "jest"

const config: Config = {
	collectCoverage: true,
	collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	testEnvironment: "node",
	preset: "@shelf/jest-mongodb",
	transform: {
		".+\\.ts$": "ts-jest"
	}
}

export default config
