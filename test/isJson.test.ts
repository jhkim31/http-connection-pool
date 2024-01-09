import isJson from "../src/utils/isJson";


describe("json validate test", () => {
  test('valid json string', () => {
    const j = {
      'a' : 123
    }
    expect(isJson(JSON.stringify(j))).toBe(true);
  })

  test('invalid json string', () => {
    expect(isJson('test')).toBe(false);
  })
})