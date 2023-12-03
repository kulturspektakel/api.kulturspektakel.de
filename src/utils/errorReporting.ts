export class ApiError extends Error {
  message: string;
  code: number;
  originalError?: Error;

  constructor(code: number, message: string, originalError?: Error) {
    super();
    this.code = code;
    this.message = message;
    this.originalError = originalError;
    this.name = 'ApiError';
    // needed for instance of check
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
