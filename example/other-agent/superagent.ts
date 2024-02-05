import ConnectionPool from 'http-connection-pool';
import superagent, {Response} from "superagent";
import app from '../server';

const PORT = 3000;
const server = app.listen(PORT);

(async () => {    
  const connectionPool = new ConnectionPool(10);  
  for (let i = 0; i < 100; i++) {
    if (i % 10 == 0) {
      connectionPool.addExternalHttpClient<Response>(superagent.get, `http://localhost:${PORT}/test`).then(d => console.log(d.text, i));
    }
    connectionPool.addExternalHttpClient<Response>(superagent.get, `http://localhost:${PORT}/test`);
  }
  await connectionPool.done();
  server.close();
})();


