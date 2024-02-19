import ConnectionPool from "http-connection-pool";
import FormData from "form-data";
import fs from "node:fs";

const c = new ConnectionPool();
const form = new FormData();

form.append('file', fs.createReadStream('./server.ts'));

c.add({
  url: "http://localhost:3000/upload",
  body: form.getBuffer(),
  headers: form.getHeaders()
}).then(d => {
  console.log(d.body);
})