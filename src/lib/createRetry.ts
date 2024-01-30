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