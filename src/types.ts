import * as http from 'node:http';
import { RequestConfig } from './core/request';

export type BeforeRetryHook = (retryCount: number) => void;
export type RetryErrorHandler = (error: unknown) => void;
export type AfterRetryHook = (retryCount: number) => void;

export type HcpRequestHeaders = { [key: string]: string };
export type HcpRequestBody = string | object;

export interface HcpResponse {
  statusCode?: number;  
  statusMessage?: string;
  headers: http.IncomingHttpHeaders;
  body: string;
  config: RequestConfig
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
    [key: string]: string | number;
  }
};

export interface HcpRequestConfig {
  url: string | UrlInfo;
  method: HTTPMethod;
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