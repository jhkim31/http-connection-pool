import ConnectionPool from "../src/index";
import app from "./server";

describe("Connection Pool Module Test", () => {
  let server: any;
  beforeAll(async () => {
    server = app.listen(3002);
  })

  afterAll(async () => {
    await server.close();
  })

  test('simple get test', async () => {
    app.use('/count/:id', (req, res) => {
      res.send(req.params.id);
    })
    const c = new ConnectionPool();

    for (let i = 0; i < 10; i++) {
      c.addRequest({
        url: {
          protocol: "http",
          host: "localhost",
          port: 3002,
          path: `/count/${i}`,
          urlQuery: {
            a: 1,
            b: 2
          }
        },
        method: "get"
      })
        .then(d => {
          expect(`${d.body}`).toBe(`${i}`);
        })
        .catch(e => {
          console.error(e);
        })
    }

    await c.done();
  });

  test('UrlInfo test (object)', async () => {
    app.use('/url/info', (req, res) => {
      res.json(req.query);
    })
    const c = new ConnectionPool();
    c.addRequest({
      url: {
        protocol: "http",
        host: "localhost",
        port: 3002,
        path: `/url/info`,
        urlQuery: {
          a: 1,
          b: "123"
        }
      },
      method: "get"
    })
      .then(d => {
        expect(JSON.parse(d.body)).toStrictEqual({ a: "1", b: "123" });
      })

    c.addRequest({
      url: "http://localhost:3002/url/info?a=1&b=123",
      method: "get"
    })
      .then(d => {
        expect(JSON.parse(d.body)).toStrictEqual({ a: "1", b: "123" });
      })
    await c.done();
  });

  test('UrlInfo test (invalid string)', async () => {    
    const c = new ConnectionPool();
    c.addRequest({
      url: "http://localhost:70000",
      method: "get"
    })
      .catch(e => {
        expect(e.code).toBe("ERR_INVALID_URL");
      })
  });

  test('retry test (number)', async () => {
    const c = new ConnectionPool();

    c.addRequest({
      url: "http://localhost:3002/retry",
      method: "get",
      retry: 3
    })
      .catch(e => {
        expect(e.config.retry.maxRetryCount).toBe(3);
      })
    await c.done();
  });

  test('retry test (object)', async () => {
    const c = new ConnectionPool();
    const st = new Date();
    await c.addRequest({
      url: "http://localhost:3002/retry",
      method: "get",
      retry: {
        maxRetryCount: 3,
        retryDelay: 1000
      }
    })
      .catch(e => {
        const et = new Date();
        expect(et.getTime() - st.getTime()).toBeGreaterThan(3000);
      })
    await c.done();
  });
})