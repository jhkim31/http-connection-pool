import ConnectionPool from 'http-connection-pool';
import fetch, {Response} from "node-fetch";
import app from '../server';

const PORT = 3000;
const server = app.listen(PORT);

(async () => {    
  const connectionPool = new ConnectionPool(10);  
  for (let i = 0; i < 100; i++) {
    if (i % 10 == 0) {
      connectionPool.addExternalHttpClient<Response>(fetch, `http://localhost:${PORT}/test`).then(d => d.text()).then(d => console.log(d, i));
    }
    connectionPool.addExternalHttpClient<Response>(fetch, `http://localhost:${PORT}/test`);
  }
  await connectionPool.done();
  server.close();
})();


