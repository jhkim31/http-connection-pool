import ConnectionPool from "../src";
import Request from "../src/core/request";
import http from "node:http";
import https from "node:https";

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

console.log(process.pid);

(async () => {
  console.log("test 1 batch request");
  const st1 = new Date();
  for (let i = 0; i < 100; i++) {
    const promiseList: Promise<any>[] = [];
    for (let j = 0; j < 10; j++) {
      const r = new Request({
        url: new URL("http://localhost:3000/test"),
        httpAgent: httpAgent,
        httpsAgent: httpsAgent
      })
      promiseList.push(r.call());
    }

    await Promise.allSettled(promiseList)
  }
  const et1 = new Date();
  console.log(et1.getTime() - st1.getTime());
  
  console.log("test 2 connection pool");
  const st2 = new Date();
  const connectionPool = new ConnectionPool(10);
  for (let i = 0; i < 1000; i++) {
    connectionPool.add({
      url: "http://localhost:3000/test"
    })    
  }
  await connectionPool.done();  
  const et2 = new Date();
  console.log(et2.getTime() - st2.getTime());
})()


