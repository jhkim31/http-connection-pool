import { TimeoutConfig } from '../types';

export function createTimeout (timeout: undefined | number | TimeoutConfig): TimeoutConfig {  
  const defaultConfig = {
   timeout: 0    
  }
  if (typeof timeout === "undefined") {
    return defaultConfig;
  } else if (typeof timeout === "number") { 
    return {
      timeout: timeout      
    }
  } else {    
    return {...defaultConfig, ...timeout};
  }
}