import app from "./server";
import Request from "../src/core/request";
import { HcpRequestError } from "../src/lib/error";

describe('Request Module Error Test', () => {
  let server: any;
  beforeAll(() => {
    server = app.listen(3001)
  })

  afterAll(() => {
    server.close();
  })

  test('404 test', async () => {
    /**
     * check 404 status code
     */
    const r = new Request({
      url: new URL("http://localhost:3001/404"),
      method: "get"
    })
    try {
      await r.call()
    } catch (error: unknown) {
      if (error instanceof HcpRequestError) {
        expect(error.res?.statusCode).toBe(404);
      }
    }
  })

  test('Unreachable Destination (port)', async () => {
    /**
     * When the host is reachable, but the port is not.
     */
    const r = new Request({
      url: new URL("http://localhost:9999"),
      method: "get"
    })
    try {
      await r.call()
    } catch (error: unknown) {
      if (error instanceof HcpRequestError) {
        expect(error.message).toBe("connect ECONNREFUSED ::1:9999");
      }
    }
  })

  test('Unreachable Destination (host)', async () => {
    /**
     * When the host is unreachable.
     */
    const r = new Request({
      url: new URL("https://jcopy.net"),
      method: "get"
    })
    try {
      await r.call()
    } catch (error: unknown) {
      if (error instanceof HcpRequestError) {
        expect(error.message).toBe("getaddrinfo ENOTFOUND jcopy.net");
      }
    }
  })

  test('retry test', async () => {
    /**
     * Inccur retry, 
     * Check how many times retryHook was actually executed
     */
    let beforeHookCounter = 0;
    let afterHookCounter = 0;
    const r = new Request({
      url: new URL("https://jcopy.net"),
      method: "get",
      retry: {
        maxRetryCount: 4,
        hooks: {
          beforeRetryHook: (c) => { beforeHookCounter += c },
          retryErrorHandler: (e) => {
            if (e instanceof Error) {
              expect(e.message).toBe("getaddrinfo ENOTFOUND jcopy.net");
            }
          },
          afterRetryHook: (c) => { afterHookCounter += c }
        }
      }
    })
    try {
      await r.call()
    } catch (error: unknown) {
      if (error instanceof HcpRequestError) {
        expect(beforeHookCounter).toBe(10);
        expect(afterHookCounter).toBe(10);
      }
    }
  })
})