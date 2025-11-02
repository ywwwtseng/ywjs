export const ErrorCodes = {
  // 400xx - Bad Request Errors
  INVALID_PARAMS: 40001,
  // 401xx - Authentication Errors
  SESSION_MISMATCH: 40101,
  SESSION_EXPIRED: 40102,
  INVALID_TOKEN: 40103,
  EXPIRED_TOKEN: 40104,
  INVALID_SIGNATURE: 40105,
  // 403xx - Authorization Errors
  INSUFFICIENT_PERMISSIONS: 40301,
  COMING_SOON: 40302,
  SYSTEM_MAINTENANCE: 40303,
  BLACKLIST_USER: 40304,
  WITHDRAWAL_RESTRICTION: 40305,

  // 404xx - Not Found Errors
  NOT_FOUND: 40401,

  // 409xx - Conflict Errors
  // DUPLICATE_ENTRY: 40901,
  // VERSION_CONFLICT: 40902,
  ALREADY_EXISTED: 40901,
  INSUFFICIENT: 40902,
  NOT_SUPPORT: 40903,
  MANY_REQUESTS: 40904,

  // 500xx - Internal Server Errors
  INTERNAL_SERVER_ERROR: 50001,
} as const;

export class AppError extends Error {
  override cause: {
    code: number;
    message: string;
    info?: Record<string, unknown>;
    status: number;
  };

  constructor(
    code: number,
    message: string,
    info?: Record<string, unknown>,
    public readonly status: number = Math.floor(code / 100)
  ) {
    super(message);

    this.cause = {
      code,
      message: this.message,
      info,
      status: this.status,
    };
  }
}

export const parseError = (error: unknown) => {
  let error_code = 50001;
  let status = 500;
  let message = 'Unknown error';
  let info = undefined;

  if (error !== null && typeof error === 'object') {
    if ('status' in error) {
      if (typeof error.status === 'number') {
        status = error.status;
      }
    }

    if ('message' in error && typeof error.message === 'string') {
      message = error.message;
    } else {
      message = JSON.stringify(error);
    }

    if ('cause' in error) {
      if (typeof error.cause === 'object') {
        if ('code' in error.cause && typeof error.cause.code === 'number') {
          error_code = error.cause.code;
        }

        if ('info' in error.cause && error.cause.info) {
          info = error.cause.info;
        }
      }
    }
  }

  return {
    error_code,
    status,
    message,
    info,
  };
};
