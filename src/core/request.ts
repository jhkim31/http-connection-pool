import http from 'node:http';
import https from 'node:https';

import { Method, Headers, RequestOptions, Response, RequestBody, Hooks } from '../types';
import { RetryError } from './error';

export default class Request {
  maxRetryCount: number;
  url: URL;

  isHttps: boolean;
  transport: typeof https | typeof http;
  agent: https.Agent | http.Agent;

  method?: string;
  headers?: Headers;
  body?: RequestBody;
  hooks?: Hooks;

  constructor(requestOptions: RequestOptions) {
    this.maxRetryCount = requestOptions.retry ?? 0;
    this.url = new URL(requestOptions.url);
    this.method = requestOptions.method;
    this.headers = requestOptions.headers;
    this.isHttps = this.url.protocol === "https:";
    this.transport = this.isHttps ? https : http;
    this.agent = new this.transport.Agent({ keepAlive: true });
    this.body = requestOptions.body;
    this.hooks = requestOptions.hooks;
  }

  call() {
    return new Promise(async (resolve, reject) => {
      let retryCount;
      for (retryCount = 0; retryCount <= this.maxRetryCount; retryCount++) {
        try {
          if (retryCount >= 1 && this.hooks?.beforeRetryHook) {            
            this.hooks.beforeRetryHook(retryCount);            
          }
          const res = await this.dispatch();
          resolve(res);
          break;
        } catch (error: unknown) {
          if (error instanceof Error) {
            if (this.hooks?.afterRetryHooks) {
              this.hooks.afterRetryHooks(error, retryCount);
            }
          } else {

          }
          
        }
      }
      throw new RetryError(`The number of retries has been exceeded. (${this.maxRetryCount})`);
    })
  }

  dispatch(): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      const req = this.transport.request(this.url, {
        method: this.method,
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