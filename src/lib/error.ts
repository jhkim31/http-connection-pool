import { RequestConfig } from "../core/request";
import http from "node:http";

export class HcpRequestError extends Error {
  config: RequestConfig;
  req?: http.ClientRequest;
  res?: http.IncomingMessage;
  origin?: Error;
  constructor(message: string, config: RequestConfig, options: {req?: http.ClientRequest, res?: http.IncomingMessage, origin?: Error}) {
    super(message);
    this.name = "HcpRequestError";
    this.config = config;
    this.req = options.req;
    this.res = options.res;
    this.origin = options.origin;
  } 
}