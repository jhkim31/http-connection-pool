import { EventEmitter } from 'node:events';

import { HcpRequestConfig, HcpResponse } from '../types';
import createUrl from '../lib/createUrl';
import Request from './request';
import createRetry from '../lib/createRetry';

type Resolve = (value: HcpResponse | PromiseLike<HcpResponse>) => void;
type Reject = (e: any) => void;

export interface RequestQueueItem {
  request: Request;
  resolve: Resolve
  reject: Reject;
}

export class ConnectionPool {
  #requestQueue: RequestQueueItem[];
  #size: number;
  #currentSize: number;
  #events: EventEmitter;

  constructor(size = 10) {
    this.#size = size;
    this.#requestQueue = [];
    this.#events = new EventEmitter();
    this.#currentSize = 0;

    this.#events.on('next', () => {
      if (this.#currentSize < this.#size && this.#requestQueue.length > 0) {
        const requestItem = this.#requestQueue.shift();
        if (requestItem !== undefined) {
          const { request, resolve, reject } = requestItem;
          this.#currentSize++;

          request.call()
            .then(resolve)
            .catch(reject)
            .finally(() => {
              this.#currentSize--;
              this.#events.emit('next');
            })
          this.#events.emit('next');
        }
      }
    })
  }

  addRequest(config: HcpRequestConfig): Promise<HcpResponse> {
    return new Promise<HcpResponse>((resolve, reject) => {
      const request = new Request({
        url: createUrl(config.url),
        method: config.method,
        retry: createRetry(config.retry)
      });

      this.#requestQueue.push({
        request,
        resolve,
        reject
      });

      this.#events.emit('next');
    })
  }

  done() {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (this.#requestQueue.length === 0) {
          resolve();
          clearInterval(interval);
        }
      }, 1000)
    })
  }
}