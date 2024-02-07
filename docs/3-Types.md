# HcpConfig
ConnectionPool configuration
```typescript
interface HcpConfig {
  size: number;
}
```
| property | required | type | description |
| :--- | :--- | :---| :---|
| size | required | <code>number</code> | Size of `ConnectionPool` (default : 10) |

# HcpRequestConfig
HTTP request configuration. 
```typescript
interface HcpRequestConfig {
  url: string | UrlInfo;
  method?: HTTPMethod;
  headers?: HcpRequestHeaders;
  body?: HcpRequestBody;
  retry?: number | RetryConfig;
  timeout?: number | TimeoutConfig;
}
```
| property | required | type | description |
| :--- | :--- | :---| :---|
| url | required | <code>string \| [UrlInfo](#urlinfo)</code> | Request url |
| method | optional | <code>[HTTPMethod](#httpmethod)</code> | HTTP Method |
| headers | optional | <code>[HcpRequestHeaders](#hcprequestheaders)</code> | Request headers |
| body | optional | <code>[HcpRequestBody](#hcprequestbody)</code> | Request body |
| retry | optional | <code>number \| [RetryConfig](#retryconfig)</code> | Defines the number of retries that fail. Default is `0`. See more [RetryConfig](#retryconfig) |
| timeout | optional | <code>[ms](#ms) \| [TimeoutConfig](#timeoutconfig)</code> | Defines the timeout(ms) for the request. Default is `0`. See more  [TimeoutConfig](#timeoutconfig) |

# UrlInfo 
Url information configuration. Protocol and host are required, and the rest are optional
```typescript
interface UrlInfo {
  protocol: "http" | "https";
  host: string;
  port?: string | number;
  path?: string;
  urlQuery?: {
    [key: string]: string | number;
  };
}
```

# HcpResponse
Request Response
```typescript
import http from "node:http";

interface HcpResponse {
  headers: http.IncomingHttpHeaders;
  body: string;
  config: RequestConfig,
  statusCode?: number;
  statusMessage?: string;  
  retryCount?: number;
}
```
| property | required | type | description |
| :--- | :--- | :---| :---|
| headers | required | <code>[http.IncomingHttpHeaders](#https://github.com/nodejs/node/blob/v20.2.0/lib/_http_incoming.js)</code> | Response message headers |
| body | required | <code>string</code> | Response message body (only string) |
| config | required | <code>[RequestConfig](#requestconfig)</code> | Configuration on request. See more [RequestConfig](#requestconfig) |
| statusCode | optional | <code>number</code> | HTTP response status codes |
| statusMessage | optional | <code>string</code> | HTTP response status messages |
| retryCount | optional | <code>number</code> | Actual retry count. Not configuration |

# RequestConfig
The interface used internally. Used to create a [HcpHttpClient](/src/core/hcpHttpClient.ts)
```typescript
interface RequestConfig {    
    url: URL;    
    method?: HTTPMethod;   
    requestHeaders?: HcpRequestHeaders;
    requestBody?: HcpRequestBody;
    httpAgent?: http.Agent;    
    httpsAgent?: https.Agent;    
    retry?: RetryConfig;
    timeout?: TimeoutConfig;    
}
```
| property | required | type | description |
| :--- | :--- | :---| :---|
| url | required | <code>[URL](#https://nodejs.org/api/url.html)</code> | URL objects created with Url information  |
| method | optional | <code>[HTTPMethod](#httpmethod)</code> | Request HTTP method |
| requestHeaders | optional | <code>[HcpRequestHeaders](#hcprequestheaders)</code> | See [HcpRequestHeaders](#hcprequestheaders) |
| requestBody | optional | <code>[HcpRequestBody](#hcprequestbody)</code> | See [HcpRequestBody](#hcprequestbody) |
| httpAgent | optional | <code>[http.Agent](https://nodejs.org/api/http.html#class-httpagent)</code> | Http Agent object (created in ConnectionPool) |
| httpsAgent | optional | <code>[https.Agent](https://nodejs.org/api/https.html#class-httpsagent)</code> | Https Agent object (created in ConnectionPool) |
| retry | optional | <code>[RetryConfig](#retryconfig)</code> | See [RetryConfig](#retryconfig) |
| timeout | optional | <code>[TimeoutConfig](#timeoutconfig)</code> | See [TimeoutConfig](#timeoutconfig) |

# RetryConfig
Retry configuration. 
```typescript
interface RetryConfig {
  retry: number;
  retryDelay?: ms;
  hooks?: {
    beforeRetryHook?: BeforeRetryHook;
    retryErrorHandler?: RetryErrorHandler;
    afterRetryHook?: AfterRetryHook;
  }
};
```
| property | required | type | description |
| :--- | :--- | :---| :---|
| retry | required | <code>number</code> | If the `retry` is set to `1`, try again if it fails, that is, it will try two times |
| retryDelay | optional | <code>[ms](#ms)</code> | Sets the delay between retries. Default is `0` |
| hooks.beforeRetryHook | optional | <code>[BeforeRetryHook](#beforeretryhook)</code> | Called before each retry. |
| hooks.retryErrorHandler | optional | <code>[RetryErrorHandler](#retryerrorhandler)</code> | Called if error occurs during retrying. |
| hooks.afterRetryHook | optional | <code>[AfterRetryHook](#afterretryhook)</code> | Called after each retry. |

# TimeoutConfig
Timeout configuration.
```typescript
interface TimeoutConfig {
  timeout: ms;  
  hooks?: {
    afterTimeoutHook?: AfterTimeoutHook;    
  }
};
```

| property | required | type | description |
| :--- | :--- | :---| :---|
| timeout | required | <code>[ms](#ms)</code> | Request timeout |
| hooks.afterTimeoutHook | optional | <code>[AfterTimeoutHook](#aftertimeouthook)</code> | Called runs after timeout event  |

# HcpRequestHeaders
HTTP Request headers.
```typescript
type HcpRequestHeaders = { [key: string]: string };
```

# HcpRequestBody
HTTP request body
```typescript
type HcpRequestBody = string | object;
```

# HcpStatus
Status of ConnectionPool.
```typescript
const HCPStatus = {
  IDLE: 'IDLE',
  BUSY: 'BUSY'
} as const;

type HcpStatus = typeof HCPStatus[keyof typeof HCPStatus];
```

* IDLE : There is not a request in progress. 
* BUSY : There is a request in progress.

# Hook
## BeforeRetryHook

```typescript
export type BeforeRetryHook = (retryCount: number) => void;
```
## RetryErrorHandler 
```typescript
export type RetryErrorHandler = (error: any) => void;
```
## AfterRetryHook
```typescript
export type AfterRetryHook = (retryCount: number) => void;
```

## AfterTimeoutHook
```typescript
export type AfterTimeoutHook = (req: http.ClientRequest) => void;
```


# HTTPMethod
```typescript
const HTTPMethod = {
  get: "get",  
  GET: "GET",
  post: "post",
  POST: "POST",
  patch: "patch",
  PATCH: "PATCH",
  put: "put",
  PUT: "PUT",
  delete: "delete",
  DELETE: "DELETE",
  options: "options",
  OPTIONS: "OPTIONS",
  head: "head",
  HEAD: "HEAD"  
} as const;

type HTTPMethod = typeof HTTPMethod[keyof typeof HTTPMethod];
```

# RequestFunction
Executable HTTP request function. Promise must be returned
```typescript
type RequestFunction<T = any> = (...args: any) => Promise<T>;
```

# ms
milliseconds
```typescript
type ms = number;
```