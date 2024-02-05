import { TimeoutConfig } from '../types';
import { HcpError, HcpErrorCode } from '../error';

export function createTimeout (timeout: undefined | number | TimeoutConfig): TimeoutConfig {  
  const defaultConfig = {
   timeout: 0    
  }
  if (typeof timeout === "undefined") {
    return defaultConfig;
  } else if (typeof timeout === "number") { 
    if (timeout < 0) {
      throw new HcpError(`The value of "timeout" expected positive number, not ${timeout}`, HcpErrorCode.BAD_REQUEST);
    }
    return {
      timeout: timeout      
    }
  } else {    
    if (timeout.timeout < 0) {
      throw new HcpError(`The value of "timeout" expected positive number, not ${timeout.timeout}`, HcpErrorCode.BAD_REQUEST);
    }
    return {...defaultConfig, ...timeout};
  }
}