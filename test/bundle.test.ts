import ConnectionPool from "../dist/index";
import app from "./server";

describe("Connection Pool Module Test", () => {
  let server: any;
  beforeAll(() => {
    server = app.listen(3010);
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
    app.use('/return/:id', (req, res) => {
      res.send(req.params.id);
    })
    const c = new ConnectionPool();

    for (let i = 0; i < 10; i++) {
      c.add({
        url: {
          protocol: "http",
          host: "localhost",
          port: 3010,
          path: `/return/${i}`,
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
    }
  });

  test('UrlInfo test (valid object)', async () => {
    /**     
     * send Request with urlQuery
     * create URL object with urlQuery in two ways.
     * validate urlQuery
     */
    app.use('/url/info', (req, res) => {
      res.json(req.query);
    })
    const c = new ConnectionPool();
    c.add({
      url: {
        protocol: "http",
        host: "localhost",
        port: 3010,
        path: `/url/info`,
        urlQuery: {
          a: "1",
          b: "123"
        }
      },
      method: "get"
    })
      .then(d => {
        expect(JSON.parse(d.body)).toStrictEqual({ a: "1", b: "123" });
      })

    c.add({
      url: "http://localhost:3010/url/info?a=1&b=123",
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
      url: "http://localhost:70000",
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
     * reason contain retryCount
     * check retryCount
     */
    const c = new ConnectionPool();

    c.add({
      url: "http://localhost:3010/retry",
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
      url: "http://localhost:3010/retry",
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