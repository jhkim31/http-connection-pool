import ConnectionPool, { HTTPMethod, HcpErrorCode } from "../../src";
import app from "../server";

const PORT = 3002;
const HOST = "localhost";
const PROTOCOL = "http";

describe("Connection Pool Module Test", () => {
  let server: any;
  beforeAll(() => {
    server = app.listen(PORT);
  })

  afterAll(() => {
    server.close();
  })

  test('simple get test', async () => {
    /**
     * Create a Connection Pool
     * Send 10 requests. /return/:id
     * check all response are correct
     */
    app.get('/return/:id', (req, res) => {
      res.send(req.params.id);
    })
    const c = new ConnectionPool();

    for (let i = 0; i < 10; i++) {
      c.add({
        url: `${PROTOCOL}://${HOST}:${PORT}/return/${i}`,
        method: HTTPMethod.get
      })
        .then(d => {
          expect(`${d.body}`).toBe(`${i}`);
        })
    }
  });

  test('UrlInfo test (valid object)', async () => {
    /**     
     * send Request with urlQuery
     * create URL object with urlQuery in two ways.
     * validate urlQuery
     */
    app.get('/url/info', (req, res) => {
      res.json(req.query);
    })
    const c = new ConnectionPool();
    c.add({
      url: {
        protocol: PROTOCOL,
        host: HOST,
        port: PORT,
        path: `/url/info`,
        urlQuery: {
          a: "1",
          b: "123"
        }
      },
      method: "get"
    })
      .then(d => {
        expect(d.config.url.href).toBe(`${PROTOCOL}://${HOST}:${PORT}/url/info?a=1&b=123`);
        expect(JSON.parse(d.body)).toStrictEqual({ a: "1", b: "123" });
      })

    c.add({
      url: `${PROTOCOL}://${HOST}:${PORT}/url/info?a=1&b=123`,
      method: "get"
    })
      .then(d => {
        expect(JSON.parse(d.body)).toStrictEqual({ a: "1", b: "123" });
      })
  });

  test('UrlInfo test (invalid string)', async () => {
    /**
     * promise rejected 
     * port number over the range
     * thrown error has property `code`
     */
    const c = new ConnectionPool();
    c.add({
      url: `${PROTOCOL}://${HOST}:70000`,
      method: "get"
    })
      .catch(e => {
        expect(e.code).toBe("ERR_INVALID_URL");
      })
  });

  test('retry test (number)', async () => {
    /**
     * Inccur Error 404.
     * 
     * Promise of ConnectionPool.addRequest() are rejected
     * check retryCount
     */
    const c = new ConnectionPool();

    c.add({
      url: `${PROTOCOL}://${HOST}:${PORT}/retry`,
      method: "get",
      retry: 3
    })
      .catch(e => {
        expect(e.retryCount).toBe(3);
      })
    await c.done();
  });

  test('retry test (time)', async () => {
    /**
     * retryDelay is the delay between each retry.
     * maxRetryCount is 3 and retryDelay is 1000ms so total 3000ms are delayed
     */
    const c = new ConnectionPool();
    const st = new Date();
    await c.add({
      url: `${PROTOCOL}://${HOST}:${PORT}/retry`,
      method: "get",
      retry: {
        retry: 3,
        retryDelay: 1000
      }
    })
      .catch(e => {
        const et = new Date();
        expect(et.getTime() - st.getTime()).toBeGreaterThan(3000);
      })
    await c.done();
  });

  test('timeout test', async () => {
    app.get('/timeout', (req, res) => {
      setTimeout(() => {
        res.send("OK");
      }, 10_000)
    });

    const c = new ConnectionPool();

    c.add({
      url: `${PROTOCOL}://${HOST}:${PORT}/timeout`,
      method: HTTPMethod.GET,
      timeout: 1000
    })
      .catch(e => {
        expect(e.code).toBe(HcpErrorCode.TIMEOUT);
      })

    await c.done();
  });

  test('ConnectionPool.getPendingRequestSize test', async () => {
    /**
     * When 20 requests are added, 10 are executed immediately, 
     * but there is a 1000ms delay, 10 requests remain in the queue.
     */
    app.get('/delay', (req, res) => {
      setTimeout(() => {
        res.send("OK");
      }, 1000)
    });
    const c = new ConnectionPool();
    for (let i = 0; i < 20; i++) {
      c.add({
        url: `${PROTOCOL}://${HOST}:${PORT}/delay`,
        method: HTTPMethod.GET
      })
    }
    expect(c.getPendingRequestSize()).toBe(10);
    await c.done();
  });

  test('GET get string test', async () => {
    app.get('/get/string', (req, res) => {
      res.send('GET');
    })
    const c = new ConnectionPool({ size: 10 });

    for (let i = 0; i < 100; i++) {
      c.add({
        url: `${PROTOCOL}://${HOST}:${PORT}/get/string`
      })
        .then(d => {
          expect(d.body).toBe("GET");
        })
    }
    await c.done();
  });

  test('GET get json test', async () => {
    app.get('/get/json', (req, res) => {
      res.json({ test: "GET" });
    })
    const c = new ConnectionPool({ size: 10 });

    for (let i = 0; i < 100; i++) {
      c.add({
        url: `${PROTOCOL}://${HOST}:${PORT}/get/json`
      })
        .then(d => {
          expect(JSON.parse(d.body)).toEqual({ test: "GET" });
        })
    }
    await c.done();
  });

  test('POST get string test', async () => {
    app.post('/get/string', (req, res) => {
      res.send('POST');
    })

    const c = new ConnectionPool({ size: 10 });

    for (let i = 0; i < 100; i++) {
      c.add({
        url: `${PROTOCOL}://${HOST}:${PORT}/get/string`,
        method: HTTPMethod.POST
      })
        .then(d => {
          expect(d.body).toBe("POST");
        })
    }
    await c.done();
  });

  test('POST get json test', async () => {
    app.post('/get/json', (req, res) => {
      res.json({ test: "POST" });
    });
    const c = new ConnectionPool({ size: 10 });

    for (let i = 0; i < 100; i++) {
      c.add({
        url: `${PROTOCOL}://${HOST}:${PORT}/get/json`,
        method: "POST"
      })
        .then(d => {
          expect(JSON.parse(d.body)).toEqual({ test: "POST" });
        })
    }
    await c.done();
  });

  test('POST send string test', async () => {
    app.post('/post/string', (req, res) => {
      res.send(req.body);
    });

    const c = new ConnectionPool({ size: 10 });

    for (let i = 0; i < 100; i++) {
      c.add({
        url: `${PROTOCOL}://${HOST}:${PORT}/post/string`,
        method: HTTPMethod.POST,
        body: "POST"
      })
        .then(d => {
          expect(d.body).toBe("POST");
        })
    }
    await c.done();
  });

  test('POST send json test', async () => {
    app.post('/post/json', (req, res) => {
      res.send(req.body);
    })
    const c = new ConnectionPool({ size: 10 });

    for (let i = 0; i < 100; i++) {
      c.add({
        url: `${PROTOCOL}://${HOST}:${PORT}/post/json`,
        method: HTTPMethod.POST,
        body: { test: "POST" }
      })
        .then(d => {
          expect(JSON.parse(d.body)).toEqual({ test: "POST" });
        })
    }
    await c.done();
  });

  test('Set headers', async () => {
    app.get('/headers', (req, res) => {
      res.json(req.headers);
    })

    const c = new ConnectionPool({ size: 10 });

    for (let i = 0; i < 100; i++) {
      c.add({
        url: `${PROTOCOL}://${HOST}:${PORT}/headers`,
        headers: {
          "Test-Header": "TestHeader"
        }
      })
        .then(d => {
          expect(d.statusCode).toBe(200);
          expect(JSON.parse(d.body)).toHaveProperty("test-header", "TestHeader");
        })
    }
    await c.done();
  });
})