import ConnectionPool from 'http-connection-pool';
import got, { Response } from "got";
import app from '../server';

const PORT = 3000;

app.get('/test', (req, res) => {
  setTimeout(() => {
    res.send("OK")
  }, Math.random() * 100);
});

const server = app.listen(PORT);

(async () => {
  const connectionPool = new ConnectionPool(10);
  for (let i = 0; i < 100; i++) {
    if (i % 10 == 0) {
      connectionPool.addExternalHttpClient<Response<any>>(got.get, "http://localhost:3000/test").then(d => console.log(d.body, i));        
    }
    connectionPool.addExternalHttpClient<Response<any>>(got.get, "http://localhost:3000/test")
  }
  await connectionPool.done();
  server.close();
})();
