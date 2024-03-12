import {
  ServerErrorStatusCode,
  ClientErrorStatusCode,
} from 'hono/utils/http-status';

export class ApiError extends Error {
  message: string;
  code: ServerErrorStatusCode | ClientErrorStatusCode;
  originalError?: Error;

  constructor(
    code: ServerErrorStatusCode | ClientErrorStatusCode,
    message: string,
    originalError?: Error,
  ) {
    super();
    this.code = code;
    this.message = message;
    this.originalError = originalError;
    this.name = 'ApiError';
    // needed for instance of check
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
