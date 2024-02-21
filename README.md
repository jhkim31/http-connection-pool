# http-connection-pool
| [npm](https://www.npmjs.com/package/http-connection-pool) | 

**http-connection-pool** quickly performs many HTTP requests in concurrently that cannot be processed at once. Like a **thread-pool**.


## Table of contents
* [Docs](#docs)
* [Installation](#installation)
* [Usage](#usage)
  * [CJS (js)](#cjs-js)
  * [ESM (js)](#esm-js)
  * [Typescript](#typescript)  
* [Use External HTTP Library](#use-external-http-library)
  * [axios](#axios)
  * [node-fetch](#node-fetch)
  
## Docs
* [Getting Started](./docs/1-GettingStarted.md)
* [API](./docs/2-API.md)
* [Types](./docs/3-Types.md)

## Installation
```bash
npm install http-connection-pool
```

## Usage
### CJS (js)
```javascript
const { ConnectionPool } = require("http-connection-pool");

const connectionPool = new ConnectionPool({size: 1000});
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

const connectionPool = new ConnectionPool({size: 1000});
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

const connectionPool = new ConnectionPool({size: 1000});
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

const connectionPool = new ConnectionPool({size: 1000});
for (let i = 0; i <= 100_000; i++) {
  connectionPool.addExternalHttpClient<AxiosResponse>(axios.get, `http://localhost:${PORT}/test`)
    .then(d => console.log(d.data, i));
}
```

### [node-fetch](./example//other-agent/node-fetch.ts);
```typescript
import ConnectionPool from 'http-connection-pool';
import fetch, {Response} from "node-fetch";

const connectionPool = new ConnectionPool({size: 1000});
for (let i = 0; i <= 100_000; i++) {
  connectionPool.addExternalHttpClient<Response>(fetch, `http://localhost:${PORT}/test`)
    .then(d => d.text())
    .then(d => console.log(d, i));
}
```