import ConnectionPool from "http-connection-pool";

const connectionPool = new ConnectionPool(10);
for (let i = 0; i <= 100; i++) {
  connectionPool.add({
    url: "http://localhost:3000"
  })
    .then(d => {
      console.log(d);
    })
    .catch(e => {
      console.error(e);
    })
}