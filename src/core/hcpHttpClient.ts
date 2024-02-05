import http from 'node:http';
import https from 'node:https';

import { ErrorCode, HcpRequestError } from '../error';
import { HTTPMethod, ms, RetryConfig, HcpRequestHeaders, HcpRequestBody, HcpResponse, AfterRetryHook, RetryErrorHandler, BeforeRetryHook, AfterTimeoutHook, TimeoutConfig } from '../types';
import { sleep } from '../utils';
import { HttpClient } from './httpClient';

/**
 * Constructor parameters of Request class
 * 
 * url is Required
 */
export interface RequestConfig {
  /**
   * Target Url Object
   */
  url: URL;
  /**
   * Request HTTP Method 
   * 
   * {@link HTTPMethod}
   */
  method?: HTTPMethod;
  /**
   * Use of an externally created httpAgent to reuse TCP connections.
   */
  httpAgent?: http.Agent;
  /**
   * Use of an externally created httpsAgent to reuse TCP connections.
   */
  httpsAgent?: https.Agent;

  /**
   * Retry Object 
   */
  retry?: RetryConfig;
  timeout?: TimeoutConfig;
  requestHeaders?: HcpRequestHeaders;
  requestBody?: HcpRequestBody;
}

/**
 * Class that performs HTTP requests.
 */
export default class HcpHttpClient extends HttpClient {
  /**
   * Setting information received from constructor
   * 
   * Save temporarily. To use it later.
   */
  config: RequestConfig;
  /**
   * Real Retry Count.
   * 
   * If the Request are retried, this count increase
   */
  retryCount: number;
  /**
   * Maximun retry Count
   * 
   * retryCount can't over this value.
   */
  maxRetryCount: number;
  /**
   * Delay between each retry ({@link ms ms})
   */
  retryDelay: ms;

  /** */
  timeout: ms;

  /**
   * Target Url Object
   */
  url: URL;
  /**
   * Request HTTP Method 
   * 
   * {@link HTTPMethod}
   */
  method?: string;

  /**
   * protocol is https or not
   */
  isHttps: boolean;
  /**
   * Built-in https/http module 
   * 
   * If protocol is https, use https module. otherwise, use http module
   */
  transport: typeof https | typeof http;
  /**
   * Same as transport.
   * 
   * Either agent uses the `keepAlive` option set to true.
   */
  agent: https.Agent | http.Agent;

  /**
   * User Custom HTTP Headers
   */
  headers?: HcpRequestHeaders;
  /**
   * User Custom HTTP Body
   * 
   * Supported 
   * * string
   * * json
   */
  body?: HcpRequestBody;

  /**
   * execute before retry
   */
  beforeRetryHook?: BeforeRetryHook;
  /**
   * execute when error caught
   */
  retryErrorHandler?: RetryErrorHandler;
  /**
   * execute after retry
   */
  afterRetryHook?: AfterRetryHook;
  /**
   * 
   */
  afterTimeoutHook?: AfterTimeoutHook;

  constructor(config: RequestConfig) {
    super();
    this.config = config;
    this.retryCount = 0;
    this.maxRetryCount = config.retry?.retry ?? 0;
    this.retryDelay = config.retry?.retryDelay ?? 0;
    this.timeout = config.timeout?.timeout ?? 0;
    this.beforeRetryHook = config.retry?.hooks?.beforeRetryHook;
    this.afterRetryHook = config.retry?.hooks?.afterRetryHook;
    this.retryErrorHandler = config.retry?.hooks?.retryErrorHandler;

    this.url = config.url;
    this.method = config.method ?? HTTPMethod.GET;
    this.headers = config.requestHeaders;
    this.isHttps = this.url.protocol === "https:";
    this.body = config.requestBody;
    this.transport = this.isHttps ? https : http;    
    this.agent = this.isHttps ? (config.httpsAgent ?? new https.Agent({keepAlive: true})) : (config.httpAgent ?? new http.Agent({keepAlive: true}));
  }

  /**
   * Performs an HTTP request according to the configuration information.
   * 
   * Only send and receive
   * @returns 
   */
  dispatch(): Promise<HcpResponse> {
    return new Promise<HcpResponse>((resolve, reject) => {
      const req = this.transport.request(this.url, {
        method: this.method,
        agent: this.agent,
        headers: this.headers
      }, (res) => {
        if (res?.statusCode && res.statusCode >= 400) {
          reject(new HcpRequestError(`${res.statusMessage} with status code ${res.statusCode}`, ErrorCode.BAD_RESPONSE,  this.config, { req, res, retryCount: this.retryCount }));
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
              config: this.config,
            })
          });   
          
          res.on('error', (e) => {            
            reject(new HcpRequestError(e.message, ErrorCode.BAD_RESPONSE, this.config, { req, origin: e, retryCount: this.retryCount }));
          })
        }
      })

      if (this.body) {
        if (typeof this.body == "string") {
          req.setHeader('Content-Type', 'text/plain');
          req.write(this.body);
        } else {
          req.setHeader('Content-Type', 'application/json');
          req.write(JSON.stringify(this.body));
        }
      }

      req.on('error', (e) => {
        reject(new HcpRequestError(e.message, ErrorCode.BAD_REQUEST, this.config, { req, origin: e, retryCount: this.retryCount }));
      });
      
      if (this.timeout > 0) {
        req.setTimeout(this.timeout, () => {          
          this.afterTimeoutHook?.(req);
          req.destroy(new HcpRequestError(`Request Timeout ${this.timeout}ms`, ErrorCode.TIMEOUT, this.config ));
        });
      }

      req.end();
    })
  }

  /**
   * Wrapper for dispatch function
   * 
   * Perform add-on functions such as retry and timeout
   * @returns 
   */
  call(): Promise<HcpResponse> {
    return new Promise(async (resolve, reject) => {
      let lastError: any;
      while (this.retryCount <= this.maxRetryCount) {
        try {
          if (this.retryCount >= 1) {
            this.beforeRetryHook?.(this.retryCount);
            await sleep(this.retryDelay);
          }

          const res = await this.dispatch();
          resolve(res);
          break;
        } catch (error: unknown) {
          this.retryErrorHandler?.(error);
          lastError = error;
        } finally {
          if (this.retryCount >= 1) {
            this.afterRetryHook?.(this.retryCount);
          }
          this.retryCount++;
        }
      }

      reject(lastError);
    })
  }
}