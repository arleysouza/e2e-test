/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/tests/integrations/**/*.test.ts"], // ignora pasta e2e
  verbose: true,
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
