import http from "node:http";
import { RequestConfig } from "./core/hcpHttpClient";

export type HcpRequestHeaders = { [key: string]: string };
export type HcpRequestBody = string | object;

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
export type RetryErrorHandler = (error: unknown) => void;
/**
 * Executed after retry.
 */
export type AfterRetryHook = (retryCount: number) => void;


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
  retry?: number | RetryConfig;
}

export interface RetryConfig {
  maxRetryCount: number;
  retryDelay?: ms;
  hooks?: {
    beforeRetryHook?: BeforeRetryHook;
    retryErrorHandler?: RetryErrorHandler;
    afterRetryHook?: AfterRetryHook;
  }
};

export type ms = number;

export type HTTPMethod =
  | "get"
  | "post"
  | "patch"
  | "put"
  | "delete"
  | "options"
  | "head"