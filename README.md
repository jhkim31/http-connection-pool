# http-connection-pool
**http-connection-pool** can be useful when need to send multiple requests if there is a limit to simultaneous connections.

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
import { ConnectionPool } from "http-connection-pool";

const connectionPool = new ConnectionPool(1_000);
for (let i = 0; i <= 100_000; i++) {
  connectionPool.add({
    url: "http://localhost:3000/get"
  })
}
```

### Typescript
```typescript
import { ConnectionPool } from "http-connection-pool";

const connectionPool = new ConnectionPool(1_000);
for (let i = 0; i <= 100_000; i++) {
  connectionPool.add({
    url: "http://localhost:3000/get"
  })
}
```

## docs
### ConnectionPool
#### workers

### 
