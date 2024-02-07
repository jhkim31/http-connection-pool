import ConnectionPool from 'http-connection-pool';
import HcpHttpClient from "../src/core/hcpHttpClient";
import app from './server';

const PORT = 3000;

const server = app.listen(PORT);

(async () => {
  console.log("test 1 serial request");
  const st1 = new Date();
  for (let i = 0; i < 10_000; i++) {
    const r = new HcpHttpClient({
      url: new URL(`http://localhost:${PORT}/test`)      
    })
    await r.call();
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
        url: new URL(`http://localhost:${PORT}/test`)
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
  const connectionPool = new ConnectionPool({size: 100});
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


