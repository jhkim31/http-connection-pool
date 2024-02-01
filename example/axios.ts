import ConnectionPool from 'http-connection-pool';
import axios, { AxiosResponse } from "axios";
import app from './server';

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
      connectionPool.addExternalHttpClient<AxiosResponse>(axios.get, `http://localhost:${PORT}/test`).then(d => console.log(d.data));
    }
    connectionPool.addExternalHttpClient<AxiosResponse>(axios.get, `http://localhost:${PORT}/test`);
  }
  await connectionPool.done();
  server.close();
})();


