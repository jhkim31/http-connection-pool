import { Retry } from "../types";

export default function createRetry (retry: undefined | number | Retry): Retry {
  if (typeof retry === "undefined") {
    return {
      maxRetryCount: 0,
      retryDelay: 0
    }
  } else if (typeof retry === "number") { 
    return {
      maxRetryCount: retry,
      retryDelay: 0
    }
  } else {
    return retry;
  }
}