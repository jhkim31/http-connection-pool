import app from "./server";
import http from "node:http";
import https from "node:https";
import Request from "../src/core/request";
import ConnectionPool from "../src";

describe("Compare connection pool and batch request", () => {
  let server: any;
  beforeAll(() => {
    server = app.listen(3003);
  })

  afterAll(() => {
    server.close();
  })

  test('simple get test', async () => {
    app.get('/test', (req, res) => {
      setTimeout(() => {
        res.send("OK");
      }, Math.random() * 100);
    });
    const httpAgent = new http.Agent({ keepAlive: true });
    const httpsAgent = new https.Agent({ keepAlive: true });

    console.log("test 1 batch request");
    const st1 = new Date();
    for (let i = 0; i < 10; i++) {
      const promiseList: Promise<any>[] = [];
      for (let j = 0; j < 10; j++) {
        const r = new Request({
          url: new URL("http://localhost:3003/test"),
          httpAgent: httpAgent,
          httpsAgent: httpsAgent
        })
        promiseList.push(r.call());
      }

      await Promise.allSettled(promiseList)
    }
    const et1 = new Date();
    console.log(`test 1 : ${et1.getTime() - st1.getTime()}ms`);

    console.log("test 2 connection pool");
    const st2 = new Date();
    const connectionPool = new ConnectionPool(10);
    for (let i = 0; i < 100; i++) {
      connectionPool.add({
        url: "http://localhost:3003/test"
      })
    }
    await connectionPool.done();
    const et2 = new Date();
    console.log(`test 2 : ${et2.getTime() - st2.getTime()}ms`);
  })
})
