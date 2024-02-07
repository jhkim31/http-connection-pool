import { EventEmitter } from 'node:events';
import http from 'node:http';
import https from 'node:https';

import { createRetry, createUrl, createTimeout } from '../lib';
import { HcpRequestConfig, HcpResponse, HcpConfig } from '../types';
import HcpHttpClient from './hcpHttpClient';
import ExternalHttpClient, { RequestFunction } from './externalHttpClient';
import { HttpClient } from './httpClient';
import { HcpErrorCode, HcpError } from '../error';

type Resolve = (value: HcpResponse | PromiseLike<HcpResponse>) => void;
type Reject = (e: any) => void;

const HCPStatus = {
  idle: 'idle',
  busy: 'busy'
} as const;

type HcpStatus = typeof HCPStatus[keyof typeof HCPStatus];

interface RequestQueueItem {
  request: HttpClient;
  resolve: Resolve | any;
  reject: Reject;
}

/**
 * Class for performing multiple HTTP requests
 * 
 * Requests are stored in an internal queue, and are pulled out and executed one by one.
 * 
 * All requests are performed as many times as possible simultaneously. (default 10)
 * 
 * If the size is 10, no more than 10 requests can be performed simultaneously.
 */
export class ConnectionPool {
  /**
   * Queue where requests are stored
   * 
   * Additional requests are added to this queue, and requests are performed on a first-in-first-out basis.
   */
  #requestQueue: RequestQueueItem[];
  /**
   * Limit the number of requests that can be performed simultaneously.
   * 
   * It has the same role as the number of threads in the thread-pool.
   */
  size: number;
  /**
   * Number of requests currently being performed concurrently.
   * 
   * This value cannot exceed size.
   */
  currentSize: number;
  /**
   * EventEmitter for internal operations
   */
  #events: EventEmitter;

  /**
   * To use the same httpAgent in many Request instances
   */
  httpAgent: http.Agent;
  /**
   * To use the same httpsAgent in many Request instances
   */
  httpsAgent: https.Agent;

  #status: HcpStatus;

  /**
   * @deprecated `ConnectionPool(size: number)` is depracated and no longer supported.
   * 
   * Use {@link HcpConfig}
   */
  constructor(size: number);
  /**
   * 
   * @param config {@link HcpConfig}
   */
  constructor(config: HcpConfig);
  constructor(config: HcpConfig | number) {
    if (typeof config === "number") {
      console.warn(`Warning: ConnectionPool(size: number) is depracated and no longer supported from the next major version. \nPlease use HcpConfig instead.`)
      this.size = config;
    } else {
      this.size = config.size;
    }
    
    this.#requestQueue = [];
    this.#events = new EventEmitter();
    this.currentSize = 0;
    this.httpAgent = new http.Agent({ keepAlive: true });
    this.httpsAgent = new https.Agent({ keepAlive: true });
    this.#status = HCPStatus.idle;
    /**
     * The 'next' event performs the queued request and calls the 'next' event.
     * 
     * When an HTTP response comes, reduce the currentSize and call the 'next' event.
     */
    this.#events.on('next', () => {
      if (this.currentSize < this.size && this.#requestQueue.length > 0) {
        const requestItem = this.#requestQueue.shift();
        if (requestItem !== undefined) {
          const { request, resolve, reject } = requestItem;
          this.currentSize++;
          this.#status = HCPStatus.busy;

          request.call()
            .then(resolve)
            .catch(reject)
            .finally(() => {
              this.currentSize--;
              this.#events.emit('next');
              if (this.currentSize === 0) {
                this.#status = HCPStatus.idle;
                this.#events.emit("done");
              }
            })
          this.#events.emit('next');
        }
      }
    })
  }


  /**
   * When a new request comes in, it adds the request to the internal queue and calls the 'next' event.
   * @param config 
   * @returns 
   */
  add(config: HcpRequestConfig): Promise<HcpResponse> {
    return new Promise<HcpResponse>((resolve, reject) => {
      try {        
        const request = new HcpHttpClient({
          url: createUrl(config.url),
          httpAgent: this.httpAgent,
          httpsAgent: this.httpsAgent,
          method: config.method,
          retry: createRetry(config.retry),
          timeout: createTimeout(config.timeout)
        });

        this.#requestQueue.push({
          request,
          resolve,
          reject
        });

        this.#events.emit('next');
      } catch (error: any) {   
        reject(new HcpError(error?.message ?? "Add Request Error", error?.code ?? HcpErrorCode.BAD_REQUEST, {origin: error}));        
      }
    })
  }

  addExternalHttpClient<ExternalHttpResponse = any>(fn: RequestFunction, ...args: any) {
    return new Promise<ExternalHttpResponse>((resolve, reject) => {     
      this.#requestQueue.push({
        request: new ExternalHttpClient(fn, ...args),
        resolve, 
        reject
      })
      this.#events.emit('next');
    })
  }

  /**
   * Return remaining queue size
   * @returns 
   */
  getPendingRequestSize() {
    return this.#requestQueue.length;
  }

  /**
   * Return Promise.
   * 
   * After calling this method, the promise is fulfilled the first time the queue size becomes 0.
   * 
   * If the queue size is 0, Promise is fulfilled immediately.
   */
  done(): Promise<void> {
    if (this.#requestQueue.length === 0 && this.#status === HCPStatus.idle) {
      return new Promise<void>((resolve) => {
        resolve();
      })     
    } else {
      return new Promise<void>((resolve) => {
        this.#events.once('done', () => {
          resolve();
        });
      })
    }
  }
}