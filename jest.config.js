/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ["./test", "./src"],
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    "default",
    ["jest-html-reporters", {
      "publicPath": "./html-report",
      "filename": "report.html",
      "expand": true
    }]
  ],  
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*',
    '!src/**/index.ts',
    '!src/**/interfaces.ts'
  ],
};