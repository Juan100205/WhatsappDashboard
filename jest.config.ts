import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  projects: [
    {
      displayName: "unit",
      testEnvironment: "jest-environment-jsdom",
      testMatch: ["**/__tests__/unit/**/*.test.ts?(x)"],
      moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
      transform: { "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }] },
    },
    {
      displayName: "api",
      testEnvironment: "node",
      testMatch: ["**/__tests__/api/**/*.test.ts"],
      moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
      transform: { "^.+\\.ts$": ["ts-jest", {}] },
      globals: {
        fetch:   global.fetch,
        Request: global.Request,
        Response:global.Response,
        Headers: global.Headers,
      },
    },
  ],
};

export default createJestConfig(config);
