import { TimeoutConfig } from '../types';
import { HcpError, HcpErrorCode } from '../error';
import { isPositiveInteger } from '../utils';


/**
 * Checks if the retryObject is valid.
 * * If valid, return true.
 * * If invalid, throw {@link HcpError}
 */
export function isValidTimeout(timeout: undefined | number | TimeoutConfig): boolean {
  if (typeof timeout === "undefined") {
  } else if (typeof timeout === "number") {
    if (!isPositiveInteger(timeout)) {      
      throw new HcpError(`The value of "timeout" expected positive number, not ${timeout}`, HcpErrorCode.INVALID_ARGS);
    }
  } else {
    if (!isPositiveInteger(timeout.timeout)) {      
      throw new HcpError(`The value of "timeout" expected positive number, not ${timeout.timeout}`, HcpErrorCode.INVALID_ARGS);
    }
  }
  return true;
}

export function createTimeout(timeout: undefined | number | TimeoutConfig): TimeoutConfig {
  isValidTimeout(timeout);

  const defaultConfig = {
    timeout: 0
  }
  if (typeof timeout === "undefined") {
    return defaultConfig;
  } else if (typeof timeout === "number") {
    return {...defaultConfig, timeout};
  } else {    
    return { ...defaultConfig, ...timeout };
  }
}