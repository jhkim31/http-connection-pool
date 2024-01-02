/// <reference types="node" />
import { EventEmitter } from "events";
import type { QueueItem } from "../types";
declare class ConnectionPool {
    queue: QueueItem[];
    maxWorkers: number;
    currentWorkers: number;
    events: EventEmitter;
    constructor(workers?: number);
    add(item: QueueItem): void;
}
export { ConnectionPool };
