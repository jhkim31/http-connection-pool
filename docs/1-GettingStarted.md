# Installation
```bash
npm install http-connection-pool
```

# Usage
## Javascript
```javascript
const { ConnectionPool } = require("http-connection-pool");

const connectionPool = new ConnectionPool(1_000);
for (let i = 0; i <= 100_000; i++) {
  connectionPool.add({
    url: "http://localhost:3000/get"
  })
}
```
## Typescript
```typescript
import ConnectionPool from "http-connection-pool";

const connectionPool = new ConnectionPool(1_000);
for (let i = 0; i <= 100_000; i++) {
  connectionPool.add({
    url: "http://localhost:3000/get"
  })
}
```

# API Docs
## [ConnectionPool](./2-ConnectionPool.md)
## [Interface](./3-Interface.md)