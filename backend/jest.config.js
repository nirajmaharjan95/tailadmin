/** @type {import('jest').Config} */
export default {
  // ts-jest's ESM preset: compiles TypeScript and emits ES modules so the
  // source's `import ... from "./x.js"` specifiers keep working under Jest.
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  // The source imports sibling modules with a .js extension (NodeNext style)
  // while the files on disk are .ts. This strips the extension so Jest can
  // resolve them.
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },

  testMatch: ["**/tests/**/*.test.ts"],
};
