/// <reference types="node" />
import { EventEmitter } from "events";
import { Response } from "superagent";
type Resolve = (d: Response) => void;
type Reject = (e: unknown) => void;
interface QueueItem {
    url: string;
    resolve: Resolve;
    reject: Reject;
}
export declare class ConnectionPool {
    queue: QueueItem[];
    maxSize: number;
    currentSize: number;
    events: EventEmitter;
    constructor(size?: number);
    add(item: QueueItem): void;
}
export { Resolve, Reject, QueueItem, Response };
