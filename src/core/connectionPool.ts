import { EventEmitter } from 'node:events';

import request from './request';

import type { HcpRequestOptions, QueueItem } from "../types";

class ConnectionPool {
  queue: QueueItem[];
  maxWorkers: number;
  currentWorkers: number;
  events: EventEmitter;  

  constructor(workers = 4) {
    this.maxWorkers = workers;
    this.queue = [];
    this.events = new EventEmitter();
    this.currentWorkers = 0;

    this.events.on('next', () => {
      try {
        if (this.currentWorkers < this.maxWorkers) {
          const item = this.queue.shift();
          if (item !== undefined) {
            this.currentWorkers++;
            const requestOptions: HcpRequestOptions = {
              url: item.url,
              method: item.method              
            }
            request(requestOptions)
              .then(item.resolve)
              .catch(item.reject)
              .finally(() => {
                this.currentWorkers--;
                this.events.emit('next');
              })
            this.events.emit('next');
          }
        }
      } catch (error: unknown) {
        console.log('e');
      }
    })
  }  

  add(item: QueueItem) {    
    this.queue.push(item);
    this.events.emit('next');
  }
}

export {ConnectionPool};