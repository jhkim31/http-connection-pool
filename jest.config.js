/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ["./test", "./src"],
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    "default",
    ["jest-html-reporters", {
      "publicPath": "./coverage",
      "filename": "index.html",
      "expand": true
    }]
  ],  
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*',
    '!src/**/index.ts',
    '!src/**/types.ts',    
  ],
  testMatch: ["**/*.test.ts", "**/*.test.mts"],
};