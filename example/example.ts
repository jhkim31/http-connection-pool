import ConnectionPool, { HcpResponse } from "http-connection-pool";

const connectionPool = new ConnectionPool();

for (let i = 0; i < 1000; i++) {
  connectionPool.add({
    url: `http://localhost:3000/test/${i}`,
    headers: {
      "test": "test"
    },
    body: {
      a: 1
    },
    retry: {
      retry: 3,
      retryDelay: 1000
    },
    timeout: 1000,
    ignoreStatusCodes: [404]
  })
    .then((d: HcpResponse) => {
      console.log(d.statusCode);
      console.log(d.headers);
      console.log(d.body);
    })
    .catch(console.error);
}
