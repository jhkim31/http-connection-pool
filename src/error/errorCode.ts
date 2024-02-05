const ErrorCode = {  
  TIMEOUT: 'TIMEOUT',
  BAD_REQUEST: "BAD_REQUEST",
  BAD_RESPONSE: 'BAD_RESPONSE',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

export {ErrorCode};



