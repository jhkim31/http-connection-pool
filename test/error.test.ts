import HcpHttpClient from '../src/core/hcpHttpClient';
import { HcpErrorCode, HcpError } from '../src/error';
import { HTTPMethod } from '../src/types';
import app from './server';

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
    const r = new HcpHttpClient({
      url: new URL("http://localhost:3001/404"),
      method: "get"
    })
    await r.call()
      .then(d => {
        fail(new Error('expected reject 404, not resolve'))
      })
      .catch(e => {
        expect(e.code).toBe(HcpErrorCode.BAD_RESPONSE);
        expect(e.res?.statusCode).toBe(404);
      })
  })

  test('Unreachable Destination (port)', async () => {
    /**
     * When the host is reachable, but the port is not.
     */
    const r = new HcpHttpClient({
      url: new URL("http://localhost:9999"),
      method: HTTPMethod.GET
    })

    await r.call()
      .then(d => {
        fail(new Error('expected ECONNREFUSED, not resolve'))
      })
      .catch(error => {
        expect(error.code).toBe("ECONNREFUSED");
        expect(error.message).toMatch(/connect ECONNREFUSED 127.0.0.1:9999|connect ECONNREFUSED ::1:9999/)
      })
  })

  test('Unreachable Destination (host)', async () => {
    /**
     * When the host is unreachable.
     */
    const r = new HcpHttpClient({
      url: new URL("https://jcopy2.net"),
      method: "get"
    })
    await r.call()
      .then(d => {
        fail(new Error('expected ENOTFOUND, not resolve'))
      })
      .catch(error => {
        expect(error.code).toBe("ENOTFOUND");
        expect(error.message).toBe("getaddrinfo ENOTFOUND jcopy2.net");
      })

  })

  test('retry test', async () => {
    /**
     * Inccur retry, 
     * Check how many times retryHook was actually executed
     */
    let beforeHookCounter = 0;
    let afterHookCounter = 0;
    const r = new HcpHttpClient({
      url: new URL("https://jcopy2.net"),
      method: "get",
      retry: {
        retry: 4,
        hooks: {
          beforeRetryHook: (c) => { beforeHookCounter += c },
          retryErrorHandler: (e) => {
            expect(e?.message).toBe("getaddrinfo ENOTFOUND jcopy2.net");
          },
          afterRetryHook: (c) => { afterHookCounter += c }
        }
      }
    })
    await r.call()
      .then(d => {        
        fail(new Error('expected ENOTFOUND, not resolve'))
      })
      .catch(error => {        
        expect(beforeHookCounter).toBe(10);
        expect(afterHookCounter).toBe(10);
      })    
  })
})