# http-connection-pool
**http-connection-pool** quickly processes many HTTP requests in concurrency that cannot be processed at once like a **thread-pool**.

## Table of contents
* [Installation](#installation)
* [Usage](#usage)
  * [CJS (js)](#cjs-js)
  * [ESM (js)](#esm-js)
  * [Typescript](#typescript)  
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
