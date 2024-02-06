# ConnectionPool
`ConnectioinPool` works like a thread pool to handle many requests simultaneously. The size of this pool determines the number of connections that can be handled simultaneously, which typically matches the number of available worker (worker) threads. Requests beyond this number are processed on standby. 

## Config
```javascript
// default size 10
new ConnectionPool(size);
```
It determines the size of the pool and limits the number of requests that can be performed simultaneously.

## Method
### ConnectionPool.add(config: [HcpRequestConfig](./Interface.md#hcprequestconfig))
Add request.2

