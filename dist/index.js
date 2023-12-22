"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = exports.ConnectionPool = void 0;
const events_1 = require("events");
const superagent_1 = require("superagent");
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return superagent_1.Response; } });
class ConnectionPool {
    constructor(size = 4) {
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.maxSize = size;
        this.queue = [];
        this.events = new events_1.EventEmitter();
        this.currentSize = 0;
        this.events.on('next', () => {
            if (this.currentSize < this.maxSize) {
                if (this.queue.length > 0) {
                    const item = this.queue[0];
                    this.queue = this.queue.slice(1);
                    this.currentSize++;
                    (0, superagent_1.get)(item.url)
                        .then(item.resolve)
                        .catch(item.reject)
                        .finally(() => {
                        this.currentSize--;
                        this.events.emit('next');
                    });
                    this.events.emit('next');
                }
            }
        });
    }
    add(item) {
        this.queue.push(item);
        this.events.emit('next');
    }
}
exports.ConnectionPool = ConnectionPool;
