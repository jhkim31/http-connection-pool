import { ErrorCode } from "./errorCode";
import { RequestConfig } from "../core/hcpHttpClient";
import http from "node:http";

export class HcpRequestError extends Error {
  errorCode: ErrorCode;
  config: RequestConfig;
  req?: http.ClientRequest;
  res?: http.IncomingMessage;
  origin?: Error;
  retryCount?: number;
  constructor(message: string, errorCode: ErrorCode, config: RequestConfig, options?: {req?: http.ClientRequest, res?: http.IncomingMessage, origin?: Error, retryCount?: number}) {
    super(message);
    this.errorCode = errorCode;    
    this.name = "HCP_REQUEST_ERROR";
    this.config = config;
    if (options?.req) {
      this.req = options.req;
    }

    if (options?.res) {
      this.res = options.res;
    }
    
    if (options?.origin && !(options.origin instanceof HcpRequestError)) {
      this.origin = options.origin;
    }
    
    if (options?.retryCount) {
      this.retryCount = options.retryCount;
    }
  } 
}