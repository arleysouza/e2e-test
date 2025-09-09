module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/tests/e2e/**/*.test.ts"],
  verbose: true,
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
