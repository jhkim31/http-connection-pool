import * as http from 'node:http';

import { AfterRetryHook, BeforeRetryHook, RetryErrorHandler } from './core/request';

export type HcpRequestHeaders = { [key: string]: string };
export type HcpRequestBody = string | object;

export interface HcpResponse {
  status?: number;
  headers: http.IncomingHttpHeaders;
  body: string;
}
export type Retry = {
  maxRetryCount: number;
  retryDelay?: number;
  hooks?: {
    beforeRetryHook?: BeforeRetryHook;
    retryErrorHandler?: RetryErrorHandler;
    afterRetryHook?: AfterRetryHook;
  }
};

export type UrlInfo = {
  protocol: "http" | "https";
  host: string;
  port?: string | number;
  path?: string;
  urlQuery?: {
    [key: string]: string;
  }
};

export interface HcpRequestOptions {
  url: string | UrlInfo;
  method: string | HTTPMethod;
  retry?: number | Retry;
}

export type HTTPMethod =
  | "get"
  | "post" 
  | "patch"
  | "put"
  | "delete" 
  | "options"
  | "head"