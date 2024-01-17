import http from 'node:http';
import https from 'node:https';

import { HcpRequestError } from '../lib/error';
import { AfterRetryHook, BeforeRetryHook, HcpRequestBody, HcpRequestHeaders, HcpResponse, HTTPMethod, Retry, RetryErrorHandler } from '../types';
import sleep from '../utils/sleep';

export interface RequestConfig {
  url: URL;
  method: HTTPMethod;

  retry?: Retry;
  requestHeaders?: HcpRequestHeaders;
  requestBody?: HcpRequestBody;
}

export default class Request {
  config: RequestConfig;
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

  constructor(config: RequestConfig) {
    this.config = config;
    this.maxRetryCount = config.retry?.maxRetryCount ?? 0;
    this.retryDelay = config.retry?.retryDelay ?? 0;
    this.beforeRetryHook = config.retry?.hooks?.beforeRetryHook;
    this.afterRetryHook = config.retry?.hooks?.afterRetryHook;
    this.retryErrorHandler = config.retry?.hooks?.retryErrorHandler;

    this.url = config.url;
    this.method = config.method;
    this.headers = config.requestHeaders;
    this.isHttps = this.url.protocol === "https:";
    this.body = config.requestBody;
    this.transport = this.isHttps ? https : http;
    this.agent = new this.transport.Agent({ keepAlive: true });
  }

  call(): Promise<HcpResponse> {
    return new Promise(async (resolve, reject) => {
      let retryCount;
      let lastError: any;
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
          lastError = error;
        } finally {
          if (retryCount >= 1 && this.afterRetryHook) {
            this.afterRetryHook(retryCount);
          }
        }
      }

      reject(lastError);
    })
  }

  dispatch(): Promise<HcpResponse> {
    return new Promise<HcpResponse>((resolve, reject) => {
      const req = this.transport.request(this.url, {
        method: this.method ?? "get",
        agent: this.agent,
        headers: this.headers
      }, (res) => {
        if (res?.statusCode && res.statusCode >= 400) {
          reject(new HcpRequestError(`${res.statusMessage} with status code ${res.statusCode}`, this.config, {req, res}));
        } else {
          let body = '';

          res.on('data', (chunk) => {
            body += chunk;
          });

          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              statusMessage: res.statusMessage,
              headers: res.headers,
              body: body,
              config: this.config
            })
          });
        }
      })

      if (this.body) {
        if (typeof this.body == "string") {
          req.write(this.body);
        } else {
          req.write(JSON.stringify(this.body));
        }
      }

      req.on('error', (e) => {
        reject(new HcpRequestError(e.message, this.config, {req, origin: e}));
      })

      req.end();
    })
  }
}