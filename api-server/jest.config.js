/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  setupFiles: ["<rootDir>/src/.jest/setEnvVars.js"],
  testPathIgnorePatterns: ["<rootDir>/src/__tests__/constants.ts"], // Exclude from test suite
};
