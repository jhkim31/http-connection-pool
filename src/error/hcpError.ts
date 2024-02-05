import { RequestConfig } from "../core/hcpHttpClient";
import http from "node:http";

export class HcpError extends Error {
  code: string;
  config?: RequestConfig;
  req?: http.ClientRequest;
  res?: http.IncomingMessage;
  origin?: any;
  retryCount?: number;
  constructor(message: string, code: string, options?: {config?: RequestConfig, req?: http.ClientRequest, res?: http.IncomingMessage, origin?: any, retryCount?: number}) {
    super(message);
    this.code = code;    
    this.name = "HCP_ERROR";
    if (options?.config) {
      this.config = options.config;
    }
    
    if (options?.req) {
      this.req = options.req;
    }

    if (options?.res) {
      this.res = options.res;
    }
    
    if (options?.origin && !(options.origin instanceof HcpError)) {
      this.origin = options.origin;
    }
    
    if (options?.retryCount) {
      this.retryCount = options.retryCount;
    }
  } 
}