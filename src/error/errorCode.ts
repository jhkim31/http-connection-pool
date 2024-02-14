const HcpErrorCode = {  
  INVALID_ARGS: "ERR_INVALID_ARGS",
  TIMEOUT: 'ERR_TIMEOUT',
  BAD_REQUEST: "ERR_BAD_REQUEST",
  BAD_RESPONSE: 'ERR_BAD_RESPONSE',
  VALUE_ERROR: "ERR_VALUE",
  TYPE_ERROR: "ERR_TYPE",
  UNKNOWN_ERROR: 'ERR_UNKNOWN',  
} as const;

type HcpErrorCode = typeof HcpErrorCode[keyof typeof HcpErrorCode];

export {HcpErrorCode};



