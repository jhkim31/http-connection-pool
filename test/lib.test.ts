import { HcpErrorCode } from "../src/error";
import {createUrl, createRetry, createTimeout} from "../src/lib";
import { UrlInfo, TimeoutConfig } from "../src/types";

describe("lib/createUrl", () => {
  test(`valid url string)`, async () => {
    /**
     * Return URL object, when valid url string
     */
    const urlStr = "http://localhost:3000";
    const url = createUrl(urlStr);
    expect(url instanceof URL).toBe(true);
  })

  test(`invalid url string)`, async () => {
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

  test(`valid parameter`, async () => {
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

  test(`invalid parameter`, async () => {
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
});
describe("lib/createRetry", () => {
  test(`valid number parameter`, async () => {
    /**
     * Return Retry Object. when valid parameter
     */
    const retry = createRetry(3);
    expect(retry.retry).toBe(3);
    expect(retry.retryDelay).toBe(0);
  });
  test(`valid Object parameter (retry)`, async () => {
    const retry2 = createRetry({
      retry: 3
    });
    expect(retry2.retry).toBe(3);
    expect(retry2.retryDelay).toBe(0);
  });
  test(`valid Object parameter (retry, retryDelay)`, async () => {
    const retry3 = createRetry({
      retry: 3,
      retryDelay: 1000
    });
    expect(retry3.retry).toBe(3);
    expect(retry3.retryDelay).toBe(1000);
  });
  test(`valid undefined parameter`, async () => {
    const retry4 = createRetry(undefined);
    expect(retry4.retry).toBe(0);
    expect(retry4.retryDelay).toBe(0);
  })
  test(`invalid number (negative integer)`, () => {
    try {
      createRetry(-1);
    } catch (error: any) {
      expect(error.message).toBe(`The value of "retry" expected positive number, not -1`);
      expect(error.code).toBe(HcpErrorCode.INVALID_ARGS)
    }    
  })
  test(`invalid number (negative integer)`, () => {
    try {
      createRetry({
        retry: 3,
        retryDelay: -1
      });
    } catch (error: any) {
      expect(error.message).toBe(`The value of "retryDelay" expected positive number, not -1`);
      expect(error.code).toBe(HcpErrorCode.INVALID_ARGS)
    }    
  })
})
describe("lib/createTimeout", () => {
  test("valid number parameter", () => {
    const timeout = createTimeout(3000);

    expect(timeout.timeout).toBe(3000);
  });

  test("valid Object parameter", () => {
    const timeout = createTimeout({timeout: 3000});

    expect(timeout.timeout).toBe(3000);
  });

  test("valid undefined parameter", () => {
    const timeout = createTimeout(undefined);

    expect(timeout.timeout).toBe(0);
  });

  test(`invalid number (negative integer)`, () => {
    try {
      createTimeout(-1);
    } catch (error: any) {
      expect(error.message).toBe(`The value of "timeout" expected positive number, not -1`);
      expect(error.code).toBe(HcpErrorCode.INVALID_ARGS)
    }    
  })  

  test(`invalid number (negative integer)`, () => {
    try {
      createTimeout({
        timeout: -1
      });
    } catch (error: any) {
      expect(error.message).toBe(`The value of "timeout" expected positive number, not -1`);
      expect(error.code).toBe(HcpErrorCode.INVALID_ARGS)
    }    
  })  
})