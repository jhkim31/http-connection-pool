const HcpErrorCode = {  
  TIMEOUT: 'ERR_TIMEOUT',
  BAD_REQUEST: "ERR_BAD_REQUEST",
  BAD_RESPONSE: 'ERR_BAD_RESPONSE',
  UNKNOWN_ERROR: 'ERR_UNKNOWN'
} as const;

type HcpErrorCode = typeof HcpErrorCode[keyof typeof HcpErrorCode];

export {HcpErrorCode};



