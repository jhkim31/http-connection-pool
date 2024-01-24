import { Retry } from "../types";

export default function createRetry (retry: undefined | number | Retry): Retry {
  const defaultConfig = {
    maxRetryCount: 0,
    retryDelay: 0
  }
  if (typeof retry === "undefined") {
    return defaultConfig;
  } else if (typeof retry === "number") { 
    return {
      maxRetryCount: retry,
      retryDelay: 0
    }
  } else {    
    return {...defaultConfig, ...retry};
  }
}