// jest.config.js
// const { createDefaultPreset } = require("ts-jest");

// /** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//   // [...]
//   transform: {
//     ...createDefaultPreset().transform,
//     // [...]
//   },
// };

import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};
