import http from 'node:http';
import https from 'node:https';

import { RetryError } from '../lib/error';
import { HcpRequestBody, HcpRequestHeaders, HcpResponse, Retry } from '../types';
import sleep from '../utils/sleep';

export type BeforeRetryHook = (retryCount: number) => void;
export type RetryErrorHandler = (error: unknown) => void;
export type AfterRetryHook = (retryCount: number) => void;

export interface RequeestOptions {
  url: URL;
  method: string;

  retry?: Retry;
  requestHeaders?: HcpRequestHeaders;
  requestBody?: HcpRequestBody;
}

export default class Request {
  maxRetryCount: number;
  retryDelay: number;
  url: URL;
  method: string;

  isHttps: boolean;
  transport: typeof https | typeof http;
  agent: https.Agent | http.Agent;

  headers?: HcpRequestHeaders;
  body?: HcpRequestBody;

  beforeRetryHook?: BeforeRetryHook;
  retryErrorHandler?: RetryErrorHandler;
  afterRetryHook?: AfterRetryHook;

  constructor(requestOptions: RequeestOptions) {
    this.maxRetryCount = requestOptions.retry?.maxRetryCount ?? 0;
    this.retryDelay = requestOptions.retry?.retryDelay ?? 0;
    this.beforeRetryHook = requestOptions.retry?.hooks?.beforeRetryHook;
    this.afterRetryHook = requestOptions.retry?.hooks?.afterRetryHook;
    this.retryErrorHandler = requestOptions.retry?.hooks?.retryErrorHandler;

    this.url = requestOptions.url;
    this.method = requestOptions.method;
    this.headers = requestOptions.requestHeaders;
    this.isHttps = this.url.protocol === "https:";
    this.body = requestOptions.requestBody;
    this.transport = this.isHttps ? https : http;
    this.agent = new this.transport.Agent({ keepAlive: true });
  }

  call(): Promise<HcpResponse> {
    return new Promise(async (resolve, reject) => {
      let retryCount;
      for (retryCount = 0; retryCount <= this.maxRetryCount; retryCount++) {
        try {
          if (retryCount >= 1) {
            if (this.beforeRetryHook) {
              this.beforeRetryHook(retryCount);
            }
            await sleep(this.retryDelay);
          }

          const res = await this.dispatch();
          resolve(res);
          break;
        } catch (error: unknown) {
          if (this.retryErrorHandler) {
            this.retryErrorHandler(error);
          }
        } finally {
          if (retryCount >= 1 && this.afterRetryHook) {
            this.afterRetryHook(retryCount);
          }
        }
      }
      reject(new RetryError(`The number of retries has been exceeded. (${this.maxRetryCount})`));
    })
  }

  dispatch(): Promise<HcpResponse> {
    return new Promise<HcpResponse>((resolve, reject) => {
      const req = this.transport.request(this.url, {
        method: this.method ?? "get",
        agent: this.agent,
        headers: this.headers
      }, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          })
        });
      })

      if (this.body) {
        if (typeof this.body == "string") {
          req.write(this.body);
        } else {
          req.write(JSON.stringify(this.body));
        }
      }

      req.on('error', (e) => {
        reject('e');
      })

      req.end();
    })
  }
}