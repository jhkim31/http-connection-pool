import ConnectionPool from '../../src';
import { HcpErrorCode} from '../../src/error';
import app from '../server';
import http from "node:http";
import https from "node:https";

const PORT = 3020;
const PROTOCOL = "http";
const HOST = "localhost";

describe('ConectionPool Error Test', () => {
  let server: any;
  beforeAll(() => {
    server = app.listen(PORT)
  })

  afterAll(() => {
    server.close();
  })

  test('Invalid constructor args', async () => {
    try {
      new ConnectionPool({
        size: 10,
        httpAgent: new http.Agent({keepAlive: true}),
        retry : -1
      });
    } catch (error: any) {
      expect(error.code).toBe(HcpErrorCode.INVALID_ARGS);
    }   
    
    try {
      new ConnectionPool({
        size: 10,
        httpAgent: new http.Agent({keepAlive: true}),
        retry : 3,
        timeout: -1
      });
    } catch (error: any) {
      expect(error.code).toBe(HcpErrorCode.INVALID_ARGS);
    }      
  })

  test('Add Request Type Error (url string)', async () => {
    const c = new ConnectionPool();

    await c.add({
      url: "wrong url"
    })
      .then(d => {
        // expect ERR_INVALID_URL, not resolve
        expect(true).toBe(false);
      })
      .catch(e => {
        expect(e.code).toBe("ERR_INVALID_URL");
      })
  })

  test('Add Request Type Error (url info)', async () => {
    const c = new ConnectionPool();

    await c.add({
      url: {
        protocol: "http",
        host: "wrong_host",
        port: 70000
      }
    })
      .then(d => {
        // expect ERR_INVALID_URL, not resolve
        expect(true).toBe(false);
      })
      .catch(e => {
        expect(e.code).toBe("ERR_INVALID_URL");
      })
  })

  test('Add Request Type Error (negative retry)', async () => {
    const c = new ConnectionPool();
    const retry = -3;
    await c.add({
      url: `${PROTOCOL}://${HOST}:${PORT}`,
      retry: retry
    })
      .then(d => {
        // expect BAD_REQUEST, not resolve
        expect(true).toBe(false);
      })
      .catch(e => {
        expect(e.message).toBe(`The value of "retry" expected positive number, not ${retry}`);
        expect(e.code).toBe(HcpErrorCode.INVALID_ARGS);
      })

    await c.add({
      url: `${PROTOCOL}://${HOST}:${PORT}`,
      retry: {
        retry: retry
      }
    })
      .then(d => {
        // expect BAD_REQUEST, not resolve
        expect(true).toBe(false);
      })
      .catch(e => {
        expect(e.message).toBe(`The value of "retry" expected positive number, not ${retry}`);
        expect(e.code).toBe(HcpErrorCode.INVALID_ARGS);
      })

    await c.add({
      url: `${PROTOCOL}://${HOST}:${PORT}`,
      retry: {
        retry: 1000,
        retryDelay: retry
      }
    })
      .then(d => {
        // expect BAD_REQUEST, not resolve
        expect(true).toBe(false);
      })
      .catch(e => {
        expect(e.message).toBe(`The value of "retryDelay" expected positive number, not ${retry}`);
        expect(e.code).toBe(HcpErrorCode.INVALID_ARGS);
      })
  })

  test('Add Request Type Error (negative timeout)', async () => {
    const c = new ConnectionPool();
    const timeout = -3;
    await c.add({
      url: `${PROTOCOL}://${HOST}:${PORT}`,
      timeout: timeout
    })
      .then(d => {
        // expect BAD_REQUEST, not resolve
        expect(true).toBe(false);
      })
      .catch(e => {
        expect(e.message).toBe(`The value of "timeout" expected positive number, not ${timeout}`);
        expect(e.code).toBe(HcpErrorCode.INVALID_ARGS);
      })

    await c.add({
      url: `${PROTOCOL}://${HOST}:${PORT}`,
      timeout: {
        timeout: -3
      }
    })
      .then(d => {
        // expect BAD_REQUEST, not resolve
        expect(true).toBe(false);
      })
      .catch(e => {
        expect(e.message).toBe(`The value of "timeout" expected positive number, not ${-3}`);
        expect(e.code).toBe(HcpErrorCode.INVALID_ARGS);
      })
  })
})