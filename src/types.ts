import * as http from 'node:http';

export type Headers = { [key: string]: string };
export type RequestBody = string | object;


export type BeforeRetryHook = (retryCount: number) => void;
export type AfterRetryHook = (error: Error, retryCount: number) => void;

export interface Hooks {
  beforeRetryHook?: BeforeRetryHook;
  afterRetryHooks?: AfterRetryHook;
}

export interface RequestOptions {
  url: string;
  method?: string;

  retry?: number;

  headers?: Headers;

  // protocol?: string;
  // host?: string;
  // port?: number | string;  
  // path?: string;

  body?: string | object;

  hooks?: Hooks;
}


export interface Response {
  status?: number;
  headers: http.IncomingHttpHeaders;
  body: string;
}

export interface QueueItem {
  url: string;
  method: string;
  resolve?: ResolveHandler;
  reject?: RejectHandler;
}
/**
 * * GET
 * * POST
 * * PATCH
 * * PUT
 * * DELETE
 * * OPTIONS
 * * HEAD
 */
export enum Method {
  GET,
  POST,
  PATCH,
  PUT,
  DELETE,
  OPTIONS,
  HEAD
}

export type ResolveHandler = (d: Response) => void;
export type RejectHandler = (e: unknown) => void;