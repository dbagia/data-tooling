const { createDefaultPreset } = require("ts-jest");

// TypeScript 6 stopped auto-including every `@types/*` package when `types` is
// unset in tsconfig, so `@types/jest`'s ambient globals (describe/it/expect/...)
// no longer reach test files implicitly. tsconfig.jest.json lists them explicitly.
const tsJestTransformCfg = createDefaultPreset({ tsconfig: 'tsconfig.jest.json' }).transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};