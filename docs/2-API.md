# ConnectionPool(config: [HcpConfig](./3-Types.md#HcpConfig))
Create a instance with configuration. 

```typescript
import ConnectionPool from 'http-connection-pool';

const c = new ConnectionPool({
  size: 100
});
```

# Method
## <code>add(requestConfig: [HcpRequestConfig](./3-Types.md#hcprequestconfig)): Promise<[HcpResponse](./3-Types.md#HcPResponse)></code>
Add a request.

`requestConfig` takes precedence over instant configuration.

```typescript
import ConnectionPool, {HTTPMethod, HcpResponse} from 'http-connection-pool';

const c = new ConnectionPool({
  size: 100
});
c.add({
  url : "http://localhost:3000",
  method : HTTPMethod.POST,
  headers : {
    "Test-Header" : "Test-Header"
  },
  body : {
    a : 1
  },
  retry : {
    retry : 3,
    retryDelay : 1000
  },
  timeout : 3000
})
.then((response: HcpResponse) => {
  console.log(response.data);
})
.catch(console.error)
```
## <code>addExternalHttpClient<`ExternalHttpResponse` = any>(fn: [RequestFunction`<ResponseType>`](./3-Types.md#requestfunction), ...args: any): Promise<`ExternalHttpResponse`></code>
* `fn` :  Promise-based executable request function
* `...args` : Arguments of request function `fn`

Add a request that uses an external HTTP client. (ex axios, node-fetch, got)

```typescript
import ConnectionPool from "http-connection-pool";
import axios, {AxiosResponse} from "axios";

const connectionPool = new ConnectionPool();

connectionPool.addExternalHttpClient<AxiosResponse>(axios.get, "http://localhost/test", {timeout: 3000})
.then(d => {
  console.log(d.data);
})
```



## <code>getPendingRequestSize(): number</code>
Returns the number of pending requests.

## <code>done(): Promise<`void`></code>
Returns `Promise<void>`, which is resolved by the following two conditions.

When the function is called,
1. If, There are no pending requests and there are no requests currently in progress, it will be resolved immediately.
2. Else then, when all requests are completed, it will be resolved.

```typescript
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