export default {
  testEnvironment: "jest-environment-jsdom", // Same name of the lib you installed
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // The file you created to extend jest config and "implement" the jest-dom environment in the jest globals
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|ttf|eot|svg)(\\?url)?$": "<rootDir>/__mocks__/fileMock.js", // The global stub for weird files
    "\\.(css|less|sass|scss)$": "identity-obj-proxy", // The mock for style related files
    "^@/(.*)$": "<rootDir>/src/$1", // [optional] Are you using aliases?
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover", "json-summary"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/main.tsx",
    "/src/vite-env.d.ts",
    "/src/monitoring.ts",
    "\\.config\\.(js|ts)$",
    "\\.d\\.ts$",
    "/__mocks__/",
    "/tests/"
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};