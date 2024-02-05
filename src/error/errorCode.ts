const HcpErrorCode = {  
  TIMEOUT: 'TIMEOUT',
  BAD_REQUEST: "BAD_REQUEST",
  BAD_RESPONSE: 'BAD_RESPONSE',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

type HcpErrorCode = typeof HcpErrorCode[keyof typeof HcpErrorCode];

export {HcpErrorCode};



