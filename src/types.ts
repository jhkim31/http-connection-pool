import * as http from 'node:http';

interface RequestOptions {
  url: string;
  method: string;

  headers?: { [key: string]: string };

  // protocol?: string;
  // host?: string;
  // port?: number | string;  
  // path?: string;

  body?: string | object;
}

interface Response {
  status?: number;
  headers: http.IncomingHttpHeaders;
  body: string;
}

interface QueueItem {
  url: string;
  method: string;
  resolve?: ResolveHandler;
  reject?: RejectHandler;
}

type ResolveHandler = (d: Response) => void;
type RejectHandler = (e: unknown) => void;

export type { ResolveHandler, RejectHandler, Response, RequestOptions, QueueItem };