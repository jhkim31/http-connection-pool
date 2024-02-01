# http-connection-pool
**http-connection-pool** quickly processes many HTTP requests in concurrency that cannot be processed at once like a **thread-pool**.

## Table of contents
* [Installation](#installation)
* [Usage](#usage)
  * [CJS (js)](#cjs-js)
  * [ESM (js)](#esm-js)
  * [Typescript](#typescript)  
* [Use External HTTP Library](#use-external-http-library)
  * [axios](#axios)
  * [node-fetch](#node-fetch)
* [Compare](#compare)

## Installation
```bash
npm install http-connection-pool
```

## Usage
### CJS (js)
```javascript
const { ConnectionPool } = require("http-connection-pool");

const connectionPool = new ConnectionPool(1_000);
for (let i = 0; i <= 100_000; i++) {
  connectionPool.add({
    url: "http://localhost:3000/get"
  })
  .then(d => {
    console.log(d)
  })
  .catch(e => {
    console.log(e)
  })
}
```

### ESM (js)
```javascript
import ConnectionPool from "http-connection-pool";

const connectionPool = new ConnectionPool(1_000);
for (let i = 0; i <= 100_000; i++) {
  connectionPool.add({
    url: "http://localhost:3000/get"
  })
  .then(d => {
    console.log(d)
  })
  .catch(e => {
    console.log(e)
  })
}
```

### Typescript
```typescript
import ConnectionPool from "http-connection-pool";

const connectionPool = new ConnectionPool(1_000);
for (let i = 0; i <= 100_000; i++) {
  connectionPool.add({
    url: "http://localhost:3000/get"
  })
  .then(d => {
    console.log(d)
  })
  .catch(e => {
    console.log(e)
  })
}
```

## [Use External HTTP Library](./example/other-agent/)
### [axios](./example//other-agent/axios.ts);
```typescript
import ConnectionPool from "http-connection-pool";
import axios, { AxiosResponse } from "axios";

const connectionPool = new ConnectionPool(1_000);
for (let i = 0; i <= 100_000; i++) {
  connectionPool.addExternalHttpClient<AxiosResponse>(axios.get, `http://localhost:${PORT}/test`)
    .then(d => console.log(d.data, i));
}
```

### [node-fetch](./example//other-agent/node-fetch.ts);
```typescript
import ConnectionPool from 'http-connection-pool';
import fetch, {Response} from "node-fetch";

const connectionPool = new ConnectionPool(1_000);
for (let i = 0; i <= 100_000; i++) {
  connectionPool.addExternalHttpClient<Response>(fetch, `http://localhost:${PORT}/test`)
    .then(d => d.text())
    .then(d => console.log(d, i));
}
```


## Compare
Compare the execution times of the three methods.
1. Serial Request
2. Batch Request(batch size 100)
3. ConnectionPool (size 100)

Send 10,000 HTTP requests to a test server that transmits results after a random delay time.
```javascript
get('/test', (req, res) => {
  setTimeout(() => {
    res.send("OK")
  }, Math.random() * 100);
});
```

[./example/compare.ts](./example/compare.ts)

```bash
test 1 serial request
test 1 : 517066ms
---------------------------------
test 2 batch request
test 2 : 10770ms
---------------------------------
test 3 connection pool
test 3 : 5180ms
```
