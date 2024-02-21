# Installation
```bash
npm install http-connection-pool
```

# Usage
## Javascript
```javascript
const { ConnectionPool } = require("http-connection-pool");

const connectionPool = new ConnectionPool({size: 1000});
for (let i = 0; i <= 100_000; i++) {
  connectionPool.add({
    url: "http://localhost:3000/get"
  })
  .then(d => {
    console.log(d.body);
  })
  .catch(e => {
    console.error(e);
  })
}
```
## Typescript
```typescript
import ConnectionPool from "http-connection-pool";

const connectionPool = new ConnectionPool({size: 1000});
for (let i = 0; i <= 100_000; i++) {
  connectionPool.add({
    url: "http://localhost:3000/get"
  })
  .then(d => {
    console.log(d.body);
  })
  .catch(e => {
    console.error(e);
  })
}
```