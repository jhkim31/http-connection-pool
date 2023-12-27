import * as http from 'http';

interface RequestOptions {
  url: string;  
  method: string;

  headers?: {[key: string] : string};
  
  // protocol?: string;
  // host?: string;
  // port?: number | string;  
  // path?: string;

  body?: string | object;
}

interface Response {
  headers: http.IncomingHttpHeaders;
  body: string;
}

export { RequestOptions, Response };