import isJsonString from "../src/utils/isJsonString";

describe("lib & utils Test", () => {  
  test('valid json string', () => {
    const j = {
      'a' : 123
    }
    expect(isJsonString(JSON.stringify(j))).toBe(true);
  })

  test('invalid json string', () => {
    expect(isJsonString('test')).toBe(false);
  })
})