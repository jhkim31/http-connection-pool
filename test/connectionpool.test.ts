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
    const c = new ConnectionPool(10);

    for (let i = 0; i < 10; i++) {
      c.addRequest({
        url: {
          protocol: "http",
          host: "localhost",
          port: 3002,
          path: `/count/${i}`,
          urlQuery: {
            a : 1,
            b : 2
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

  test('test UrlInfo', async () => {
    app.use('/url/info', (req, res) => {      
      res.json(req.query);
    })
    const c = new ConnectionPool();

    for (let i = 0; i < 3; i++) {
      c.addRequest({
        url: {
          protocol: "http",
          host: "localhost",
          port: 3002,
          path: `/url/info`,
          urlQuery: {
            a : 1,
            b : "123"
          }
        },
        method: "get"
      })
        .then(d => {
          expect(JSON.parse(d.body)).toStrictEqual({a : 1, b : "123"});
        })
        .catch(e => {
          console.error(e);
        })
    }

    await c.done();
  });
})