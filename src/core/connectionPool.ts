import { EventEmitter } from 'node:events';
import http from 'node:http';
import https from 'node:https';

import createRetry from '../lib/createRetry';
import createUrl from '../lib/createUrl';
import { HcpRequestConfig, HcpResponse, ms } from '../types';
import Request from './request';

type Resolve = (value: HcpResponse | PromiseLike<HcpResponse>) => void;
type Reject = (e: any) => void;

export interface RequestQueueItem {
  request: Request;
  resolve: Resolve
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

  constructor(size = 10) {
    this.size = size;
    this.#requestQueue = [];
    this.#events = new EventEmitter();
    this.currentSize = 0;
    this.httpAgent = new http.Agent({ keepAlive: true });
    this.httpsAgent = new https.Agent({ keepAlive: true });
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

          request.call()
            .then(resolve)
            .catch(reject)
            .finally(() => {
              this.currentSize--;
              this.#events.emit('next');
              if (this.currentSize === 0) {
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
        const request = new Request({
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
    if (this.#requestQueue.length === 0) {
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

export {Request};