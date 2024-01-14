import ConnectionPool from "../src";

const connectionPool = new ConnectionPool(10);
for (let i = 0; i <= 100; i++) {
  connectionPool.addRequest({
    url: "http://localhost:3000",
    method: "get"
  })
    .then(d => {
      console.log(d);
    })
    .catch(e => {
      console.error(e);
    })
}