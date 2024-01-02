"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionPool = void 0;
const events_1 = require("events");
const request_1 = __importDefault(require("./request"));
class ConnectionPool {
    constructor(workers = 4) {
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxWorkers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentWorkers", {
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
        this.maxWorkers = workers;
        this.queue = [];
        this.events = new events_1.EventEmitter();
        this.currentWorkers = 0;
        this.events.on('next', () => {
            try {
                if (this.currentWorkers < this.maxWorkers) {
                    const item = this.queue.shift();
                    if (item !== undefined) {
                        this.currentWorkers++;
                        const requestOptions = {
                            url: item.url,
                            method: item.method
                        };
                        (0, request_1.default)(requestOptions)
                            .then(item.resolve)
                            .catch(item.reject)
                            .finally(() => {
                            this.currentWorkers--;
                            this.events.emit('next');
                        });
                        this.events.emit('next');
                    }
                }
            }
            catch (error) {
                console.log('e');
            }
        });
    }
    add(item) {
        this.queue.push(item);
        this.events.emit('next');
    }
}
exports.ConnectionPool = ConnectionPool;
