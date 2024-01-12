import { EventEmitter } from 'node:events';
import Request from './request';

export type ResolveHandler = (value: unknown) => void;
export type RejectHandler = (e: any) => void;

// export type UrlInfo = string | {
//   protocol: string;
//   host: string;
//   port?: string | number;
//   path?: string;
//   parameter?: {
//     [key: string]: string;
//   }
// }

export type UrlInfo = string;

export interface RequestOptions {
  url: UrlInfo;
  method: string;
}


export interface QueueItem {
  url: UrlInfo;
  method: string;
  resolve: ResolveHandler
  reject: RejectHandler;
}

export class ConnectionPool {
  #requestQueue: QueueItem[];
  #size: number;
  #currentSize: number;
  #events: EventEmitter;  

  constructor(size = 10) {
    this.#size = size;
    this.#requestQueue = [];
    this.#events = new EventEmitter();
    this.#currentSize = 0;

    this.#events.on('next', () => {
      try {
        if (this.#currentSize < this.#size && this.#requestQueue.length > 0) {
          const request = this.#requestQueue.shift();
          if (request !== undefined) {
            this.#currentSize++;
            const r = new Request({
              url: new URL(request.url),
              method: "get"
            })
            
            r.call()
            .then(request.resolve)
            .catch(request.reject)
            .finally(() => {
                this.#currentSize--;
                this.#events.emit('next');
            })
            this.#events.emit('next');
          }
        }
      } catch (error: unknown) {
        console.log('e');
      }
    })
  }  

  add(options: RequestOptions) {        
    return new Promise((resolve, reject) => {      
      this.#requestQueue.push({
        url: options.url,
        method: options.method,
        resolve: resolve,
        reject: reject
      });
      this.#events.emit('next');  
    })
  }
}