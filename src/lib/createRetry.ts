import { HcpError, HcpErrorCode } from '..';
import { RetryConfig } from '../types';
import { isPositiveInteger } from "../utils";

/**
 * Checks if the retryObject is valid.
 * * If valid, return true.
 * * If invalid, throw {@link HcpError}
 */
export function isValidRetry(retry: undefined | number | RetryConfig): boolean {
  if (typeof retry === "undefined") {    
  } else if (typeof retry === "number") {
    if (!isPositiveInteger(retry)) {
      throw new HcpError(`The value of "retry" expected positive number, not ${retry}`, HcpErrorCode.INVALID_ARGS);
    }
  } else {
    if (!(typeof retry.hooks?.afterRetryHook === "function") && !(typeof retry.hooks?.afterRetryHook === "undefined")) {
      throw new HcpError(`The value of "afterRetryHook" expected function, not ${typeof retry.hooks.afterRetryHook}`, HcpErrorCode.TYPE_ERROR);
    }

    if (!(typeof retry.hooks?.beforeRetryHook === "function") && !(typeof retry.hooks?.beforeRetryHook === "undefined")) {
      throw new HcpError(`The value of "beforeRetryHook" expected function, not ${typeof retry.hooks.beforeRetryHook}`, HcpErrorCode.TYPE_ERROR);
    }

    if (!(typeof retry.hooks?.retryErrorHandler === "function") && !(typeof retry.hooks?.retryErrorHandler === "undefined")) {
      throw new HcpError(`The value of "retryErrorHandler" expected function, not ${typeof retry.hooks.retryErrorHandler}`, HcpErrorCode.TYPE_ERROR);
    }

    if (!isPositiveInteger(retry.retry)) {
      throw new HcpError(`The value of "retry" expected positive number, not ${retry.retry}`, HcpErrorCode.INVALID_ARGS);
    }
    if (!isPositiveInteger(retry.retryDelay ?? 1)) {
      throw new HcpError(`The value of "retryDelay" expected positive number, not ${retry.retryDelay}`, HcpErrorCode.INVALID_ARGS);
    }    
  }
  return true;
}

/**
 * ```typescript
 * const defaultConfig = {
    maxRetryCount: 0,
    retryDelay: 0
  }
 * ```
  Return {@link RetryConfig RetryConfig}

 * If the param is 
 * * undefined => {@link defaultConfig}
 * * number => {@link defaultConfig defaultConfig (replace maxRetryCount)}
 * * Retry Object => as it is
 * @param retry 
 * @returns 
 */


export function createRetry(retry: undefined | number | RetryConfig): RetryConfig {
  isValidRetry(retry);

  const defaultConfig = {
    retry: 0,
    retryDelay: 0
  }

  if (typeof retry === "undefined") {
    return defaultConfig;
  } else if (typeof retry === "number") {
    return { ...defaultConfig, retry };
  } else {
    return { ...defaultConfig, ...retry };
  }
}