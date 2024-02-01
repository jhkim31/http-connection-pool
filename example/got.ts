import ConnectionPool from 'http-connection-pool';
import got, { Response } from "got";
import app from './server';

const PORT = 3000;

app.get('/test', (req, res) => {
  setTimeout(() => {
    res.send("OK")
  }, Math.random() * 100);
});

const server = app.listen(PORT);

(async () => {
  const c = new ConnectionPool(1);
  for (let i = 0; i < 1; i++) {
    c.addExternalHttpClient<Response<any>>(got.get, "http://localhost:3000/test")
      .then(d => console.log(d.body))
      .catch(e => console.log(e));
  }
  await c.done();
  server.close();
})();
