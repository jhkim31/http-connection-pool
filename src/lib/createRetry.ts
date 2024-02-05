import { HcpError, HcpErrorCode } from '..';
import { RetryConfig } from '../types';

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

export function createRetry (retry: undefined | number | RetryConfig): RetryConfig {
  const defaultConfig = {
    retry: 0,
    retryDelay: 0
  }

  if (typeof retry === "undefined") {
    return defaultConfig;
  } else if (typeof retry === "number") { 
    if (retry < 0) {
      throw new HcpError(`The value of "retry" expected positive number, not ${retry}`, HcpErrorCode.BAD_REQUEST);
    }
    return {
      retry: retry,
      retryDelay: 0
    }
  } else {    
    if (retry.retry < 0) {
      throw new HcpError(`The value of "retry" expected positive number, not ${retry.retry}`, HcpErrorCode.BAD_REQUEST);
    }
    if ((retry?.retryDelay ?? 0) < 0) {      
      throw new HcpError(`The value of "retryDelay" expected positive number, not ${retry.retryDelay}`, HcpErrorCode.BAD_REQUEST);
    }
    return {...defaultConfig, ...retry};
  }
}