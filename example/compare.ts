import ConnectionPool, { HcpHttpClient } from 'http-connection-pool';
import http from 'node:http';
import https from 'node:https';

import app from './server';

const PORT = 3000;

const server = app.listen(PORT);
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

(async () => {
  console.log("test 1 serial request");
  const st1 = new Date();
  for (let i = 0; i < 10; i++) {
    const r = new HcpHttpClient({
      url: new URL(`http://localhost:${PORT}/test`),
      httpAgent: httpAgent,
      httpsAgent: httpsAgent
    })
    await r.call().then(d => console.log(d.body));
  }
  const et1 = new Date();
  console.log(`test 1 : ${et1.getTime() - st1.getTime()}ms`);
  console.log('---------------------------------');

  console.log("test 2 batch request");
  const st2 = new Date();
  for (let i = 0; i < 100; i++) {
    const promiseList: Promise<any>[] = [];
    for (let j = 0; j < 100; j++) {
      const r = new HcpHttpClient({
        url: new URL(`http://localhost:${PORT}/test`),        
        httpAgent: httpAgent,
        httpsAgent: httpsAgent
      })
      promiseList.push(r.call());
    }
    await Promise.allSettled(promiseList)
  }
  const et2 = new Date();
  console.log(`test 2 : ${et2.getTime() - st2.getTime()}ms`);
  console.log('---------------------------------');

  console.log("test 3 connection pool");
  const st3 = new Date();
  const connectionPool = new ConnectionPool(100);
  for (let i = 0; i < 10000; i++) {
    connectionPool.add({
      url: `http://localhost:${PORT}/test`
    })
  }
  await connectionPool.done();
  const et3 = new Date();
  console.log(`test 3 : ${et3.getTime() - st3.getTime()}ms`);

  server.close();
})()


