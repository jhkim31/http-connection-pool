import { EventEmitter } from "events";
import { get, Response, agent } from "superagent";
import * as https from "https";

type Resolve = (d: Response) => void;
type Reject = (e: unknown) => void;

interface QueueItem {
    url: string;    
    method: string;
    resolve: Resolve;
    reject: Reject;
}

class ConnectionPool {
    queue: QueueItem[];
    maxSize: number;
    currentSize: number;
    events: EventEmitter;

    constructor(size = 4) {
        const agent = new https.Agent({keepAlive: true});
        this.maxSize = size;
        this.queue = [];
        this.events = new EventEmitter();
        this.currentSize = 0;        
        this.events.on('next', () => {
            if (this.currentSize < this.maxSize) {
                if (this.queue.length > 0) {
                    const item = this.queue[0];
                    this.queue = this.queue.slice(1);
                    this.currentSize++;                    
                    get(item.url)                        
                        .agent(agent)
                        .then(item.resolve)
                        .catch(item.reject)
                        .finally(() => {
                            this.currentSize--;
                            this.events.emit('next');
                        })
                    this.events.emit('next');
                }

            }
        })
    }

    add(item: QueueItem) {
        this.queue.push(item);
        this.events.emit('next');
    }
}

export default ConnectionPool;
export { Resolve, Reject, QueueItem };