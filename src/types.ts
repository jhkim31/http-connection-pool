import http from "node:http";
import https from "node:https";
import stream from "node:stream"
import { RequestConfig } from "./core/hcpHttpClient";

export interface HcpConfig {
  size: number;
  httpAgent?: http.Agent;
  httpsAgent?: https.Agent;
  retry?: number | RetryConfig;
  timeout?: ms | TimeoutConfig;
}

export type HcpRequestHeaders = { [key: string]: string };
export type HcpRequestBody = string | object | stream;

export interface HcpResponse {
  statusCode?: number;
  statusMessage?: string;
  headers: http.IncomingHttpHeaders;
  body: string;
  config: RequestConfig,
  retryCount?: number;
}
/**
 * Executed before retry.
 */
export type BeforeRetryHook = (retryCount: number) => void;
/**
 * Executed when error caught.
 */
export type RetryErrorHandler = (error: any) => void;
/**
 * Executed after retry.
 */
export type AfterRetryHook = (retryCount: number) => void;

export type AfterTimeoutHook = (req: http.ClientRequest) => void;

export interface UrlInfo {
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
  method?: HTTPMethod;
  headers?: HcpRequestHeaders;
  body?: HcpRequestBody;
  retry?: number | RetryConfig;
  timeout?: ms | TimeoutConfig;
}

export interface RetryConfig {
  retry: number;
  retryDelay?: ms;
  hooks?: {
    beforeRetryHook?: BeforeRetryHook;
    retryErrorHandler?: RetryErrorHandler;
    afterRetryHook?: AfterRetryHook;
  }
};

export interface TimeoutConfig {
  timeout: ms;  
  hooks?: {
    afterTimeoutHook?: AfterTimeoutHook;    
  }
};

export type ms = number;

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

export {HTTPMethod};