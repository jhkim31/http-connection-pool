# ConnectionPool
**ConnectionPool** can quickly perform many HTTP requests that cannot be processed at once. 
ConnectionPool always tries to empty the requestQueue and performs requests concurrently up to the size of ConnectionPool. The request is performed concurrently up to size of ConnectionPool, and when one request is completed, the next request that is stored in the queue is performed.

## Config: [HcpConfig](./3-Types.md#HcpConfig)

Create a instance with configuration. 

```javascript
import ConnectionPool from 'http-connection-pool';

const c = new ConnectionPool({
  size: 100
});
```

## Method
### <code>add(requestConfig: [HcpRequestConfig](./3-Types.md#hcprequestconfig)): Promise<[HcpResponse](./3-Types.md#HcPResponse)></code>
Add a request. The added request will be performed without any additional processing.

If configuration passed as arguments when adding a request, the request is performed with the new configuration.

The order of request execution is guaranteed, but the order of completion is not.

### <code>addExternalHttpClient<`ExternalHttpResponse` = any>(fn: [RequestFunction`<ResponseType>`](./3-Types.md#requestfunction), ...args: any): Promise<`ExternalHttpResponse`></code>
* `fn` :  Promise-based executable request function
* `...args` : Arguments of request function `fn`

Add a request that uses an external HTTP client. (ex axios, node-fetch, got)

The order of request execution is guaranteed, but the order of completion is not.

```javascript
import axios, {AxiosResponse} from "axios";

...

connectionPool.addExternalHttpClient<AxiosResponse>(axios.get, "http://localhost/test", {timeout: 3000})
```



### <code>getPendingRequestSize(): number</code>
Returns the number of pending requests currently waiting in the [#requestQueue](#property) (size of `#requestQueue`)

### <code>done(): Promise<`void`></code>
Returns `Promise<void>`, which is resolved by the following two conditions.

When the function is called,
1. If, the [#requestQueue](#property) is empty and the [#status](#property) is [IDLE](./3-Types.md#hcpstatus), it will be resolved immediately.
2. Else then, when all requests are completed([#requestQueue](#property)), it will be resolved.

```javascript
import ConnectionPool from 'http-connection-pool';

const connectionPool = new ConnectionPool({size: 100});

// Resolved immediately (no any requests)
await connectionPool.done(); 

for (let i = 0; i < 100_000; i++) {
  connectionPool.add({
    url: `http://localhost/test/${i}`
  })
}

// Will be resolved, when all 100_000 requests are completed.
await connectionPool.done();
```