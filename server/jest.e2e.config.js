module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/tests/e2e/**/*.test.ts"],
  verbose: true,
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
