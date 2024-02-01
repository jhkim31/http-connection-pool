import { RequestConfig } from "../core/hcpHttpClient";
import http from "node:http";

export class HcpRequestError extends Error {
  config: RequestConfig;
  req?: http.ClientRequest;
  res?: http.IncomingMessage;
  origin?: Error;
  retryCount?: number;
  constructor(message: string, config: RequestConfig, options: {req?: http.ClientRequest, res?: http.IncomingMessage, origin?: Error, retryCount?: number}) {
    super(message);
    this.name = "HcpRequestError";
    this.config = config;
    this.req = options.req;
    this.res = options.res;
    this.origin = options.origin;
    this.retryCount = options.retryCount;
  } 
}