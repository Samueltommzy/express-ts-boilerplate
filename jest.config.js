/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: "node",
	transform: {
		"^.+.tsx?$": ["ts-jest", {}],
	},
	testRegex: "(__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
	moduleFileExtensions: ["ts", "tsx", "js"],
	collectCoverage: true,
	coverageDirectory: "coverage",
	collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
	testPathIgnorePatterns: ["dist"],
};
