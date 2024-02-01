import { EventEmitter } from 'node:events';
import http from 'node:http';
import https from 'node:https';

import { createRetry, createUrl } from '../lib';
import { HcpRequestConfig, HcpResponse } from '../types';
import HcpHttpClient, { RequestConfig } from './hcpHttpClient';
import ExternalHttpClient, { RequestFunction } from './externalHttpClient';
import { HttpClient } from './httpClient';

type Resolve = (value: HcpResponse | PromiseLike<HcpResponse>) => void;
type Reject = (e: any) => void;

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

  #status: number;

  constructor(size = 10) {
    this.size = size;
    this.#requestQueue = [];
    this.#events = new EventEmitter();
    this.currentSize = 0;
    this.httpAgent = new http.Agent({ keepAlive: true });
    this.httpsAgent = new https.Agent({ keepAlive: true });
    this.#status = 0;
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
          this.#status = 1;

          request.call()
            .then(resolve)
            .catch(reject)
            .finally(() => {
              this.currentSize--;
              this.#events.emit('next');
              if (this.currentSize === 0) {
                this.#status = 0;
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
          retry: createRetry(config.retry)
        });

        this.#requestQueue.push({
          request,
          resolve,
          reject
        });

        this.#events.emit('next');
      } catch (error) {
        reject(error);
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
  getRemainingQueueSize() {
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
    if (this.#requestQueue.length === 0 && this.#status === 0) {
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

export { HcpHttpClient, RequestConfig };