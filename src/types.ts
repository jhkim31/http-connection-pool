import * as http from 'node:http';

export type HcpRequestHeaders = { [key: string]: string };
export type HcpRequestBody = string | object;

export type BeforeRetryHook = (retryCount: number) => void;
export type RetryErrorHandler = (error: unknown) => void;
export type AfterRetryHook = (retryCount: number) => void;

export interface Retry {
  maxRetryCount: number;
  retryDelay?: number;
  hooks?: {
    beforeRetryHook?: BeforeRetryHook;
    retryErrorHandler?: RetryErrorHandler;
    afterRetryHook?: AfterRetryHook;
  }
}

export interface HcpRequestOptions {
  url: string;
  method?: string;

  retry?: number | Retry;

  headers?: HcpRequestHeaders;

  // protocol?: string;
  // host?: string;
  // port?: number | string;  
  // path?: string;

  body?: HcpRequestBody;
}


export interface HcpResponse {
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

export type ResolveHandler = (d: HcpResponse) => void;
export type RejectHandler = (e: unknown) => void;