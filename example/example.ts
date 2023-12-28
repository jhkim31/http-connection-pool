import ConnectionPool from "..";

const connectionPool = new ConnectionPool(10);
for (let i = 0; i <= 100; i++) {
  connectionPool.add({
    url: "http://localhost:3000",
    method: "get"
  })
}