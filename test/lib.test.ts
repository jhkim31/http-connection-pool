import {isJsonString, sleep} from "../src/utils";
import {createUrl, createRetry} from "../src/lib";
import { UrlInfo } from "../src/types";

describe("lib & utils Test", () => {

  test('[utils/isJsonString] valid json string', () => {
    /**
     * Return true, when valid json string
     */
    const j = {
      'a': 123
    }
    expect(isJsonString(JSON.stringify(j))).toBe(true);
  })

  test('[utils/isJsonString] invalid json string', () => {
    /**
     * Return false, when invalid json string
     */
    expect(isJsonString('test')).toBe(false);
  })

  test(`[lib/sleep] sleep delay test`, async () => {
    /**
     * sleep function delay test
     */
    const st = new Date();
    await sleep(1000);

    const et = new Date();
    expect(et.getTime() - st.getTime()).toBeGreaterThanOrEqual(1000);
  })

  test(`[lib/createUrl] valid url string)`, async () => {
    /**
     * Return URL object, when valid url string
     */
    const urlStr = "http://localhost:3000";

    const url = createUrl(urlStr);

    expect(url instanceof URL).toBe(true);
  })

  test(`[lib/createUrl] invalid url string)`, async () => {
    /**
     * throw Error, when invalie url string
     * 1. port number over the range
     * 2. protocol (http://, https://) is missing
     */
    try {

      const urlStr1 = "http://localhost:70000";
      createUrl(urlStr1);
    } catch (error: any) {
      expect(error.code).toBe("ERR_INVALID_URL");
    }

    try {
      const urlStr2 = "localhost:3000";
      createUrl(urlStr2);
    } catch (error: any) {
      expect(error.code).toBe("ERR_INVALID_URL");
    }
  })

  test(`[lib/createUrl] valid parameter`, async () => {
    /**
     * Return URL Object, when valid parameter
     */
    const url = createUrl({
      host: "localhost",
      protocol: "http",
      path: "test/abc",
      urlQuery: {
        a: '1',
        b: '2'
      }
    });

    expect(url instanceof URL).toBe(true);
    expect(url.href).toBe("http://localhost/test/abc?a=1&b=2");
  })

  test(`[lib/createUrl] invalid parameter`, async () => {
    /**
     * throw Error, when invalid parameter.
     * port number over the range.
     */
    try {
      const options: UrlInfo = {
        host: "localhost",
        protocol: "http",
        path: "//test",
        port: 70000
      }
      createUrl(options);
    } catch (error: any) {
      expect(error.code).toBe("ERR_INVALID_URL");
    }
  })

  test(`[lib/createRetry] valid parameter`, async () => {
    /**
     * Return Retry Object. when valid parameter
     */
    const retry = createRetry(3);
    expect(retry.retry).toBe(3);
    expect(retry.retryDelay).toBe(0);

    const retry2 = createRetry({
      retry: 3
    });
    expect(retry2.retry).toBe(3);
    expect(retry2.retryDelay).toBe(0);

    const retry3 = createRetry({
      retry: 3,
      retryDelay: 1000
    });
    expect(retry3.retry).toBe(3);
    expect(retry3.retryDelay).toBe(1000);

    const retry4 = createRetry(undefined);
    expect(retry4.retry).toBe(0);
    expect(retry4.retryDelay).toBe(0);
  })
})