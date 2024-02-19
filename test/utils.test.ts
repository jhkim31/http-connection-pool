import {isJsonString, isPositiveInteger, sleep} from "../src/utils";

describe("utils/isJsonString", () => {
  test('valid json string', () => {
    /**
     * Return true, when valid json string
     */
    const j = {
      'a': 123
    }
    expect(isJsonString(JSON.stringify(j))).toBe(true);
  })

  test('invalid json string', () => {
    /**
     * Return false, when invalid json string
     */
    expect(isJsonString('test')).toBe(false);
  })
});

describe("utils/sleep", () => {
  test(`sleep delay test`, async () => {
    /**
     * sleep function delay test
     */
    const st = new Date();
    await sleep(1000);

    const et = new Date();
    expect(et.getTime() - st.getTime()).toBeGreaterThanOrEqual(1000);
  })
}); 

describe("utils/isPositiveInteger", () => {
  test(`positive integer`,() => {   
    expect(isPositiveInteger(3)).toBe(true);
  })

  test(`negative integer`,() => {   
    expect(isPositiveInteger(-33)).toBe(false);
  })

  test(`zero`,() => {   
    expect(isPositiveInteger(0)).toBe(false);
  })

  test(`positive float`,() => {   
    expect(isPositiveInteger(3.2)).toBe(false);
  })
}); 

