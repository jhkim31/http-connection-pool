import app from "./server";
import http from "node:http";
import https from "node:https";
import Request from "../src/core/request";
import ConnectionPool from "../src";

describe("Compare connection pool and batch request", () => {
  let server: any;
  const httpAgent = new http.Agent({ keepAlive: true });
  const httpsAgent = new https.Agent({ keepAlive: true });
  beforeAll(() => {
    server = app.listen(3003);
    app.get('/test', (req, res) => {
      setTimeout(() => {
        res.send("OK");
      }, Math.random() * 200);
    });

  })

  afterAll(() => {
    server.close();
  })

  test('Process 100 requests in 10 batches', async () => {
    console.log("test 1 batch request");
    const st = new Date();
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
    const et = new Date();
    console.log(`test 1 : ${et.getTime() - st.getTime()}ms`);
  })
  test('Process 100 requests in ConnectionPool(10)', async () => {

    console.log("test 2 connection pool");
    const st = new Date();
    const connectionPool = new ConnectionPool(10);
    for (let i = 0; i < 100; i++) {
      connectionPool.add({
        url: "http://localhost:3003/test"
      })
    }
    await connectionPool.done();
    const et = new Date();    
    console.log(`test 2 : ${et.getTime() - st.getTime()}ms`);    
  })
})
