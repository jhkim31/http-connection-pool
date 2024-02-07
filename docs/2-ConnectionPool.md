# ConnectionPool
**ConnectionPool** can quickly perform many HTTP requests that cannot be processed at once. 
ConnectionPool always tries to empty the requestQueue and performs requests concurrently up to the size of ConnectionPool. The request is performed concurrently up to size of ConnectionPool, and when one request is completed, the next request that is stored in the queue is performed.

## Property 
| property | type | description|
| :--- | :--- | :--- |
| #requestQueue | [RequestQueueItem](./3-Interface.md#requestqueueitem)[] | The queue to store requests |
| #status | [HcpStatus](./3-Interface.md#hcpstatus) | Indicates the current state of the ConnectionPool. |
| size | number | Limit the maximum number of http connections that can be performed concurrently. |


## Config: [HcpConfig](./3-Interface.md#HcpConfig)

```json
{
  size: 10 //default
}
```
| property | type | default | description |
| :--- | :--- | :---| :--- |
| size | number | 10 | Defines the size of ConnectionPool |

```javascript
import ConnectionPool from 'http-connection-pool';

const c = new ConnectionPool({
  size: 100;
});
```

## Method
### <code>ConnectionPool.add(requestConfig: [HcpRequestConfig](./3-Interface.md#hcprequestconfig)): Promise<[HcpResponse](./3-Interface.md#HcPResponse)></code>


### <code>ConnectionPool.addExternalHttpClient<ExternalHttpResponse = any>(fn: RequestFunction, ...args: any): Promise<ExternalHttpResponse></code>