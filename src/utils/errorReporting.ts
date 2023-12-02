import {ErrorRequestHandler} from 'express';
import * as Sentry from '@sentry/node';

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

export const errorReportingMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  res.type('text/plain');
  if (err instanceof ApiError) {
    Sentry.withScope((scope) => {
      scope.addEventProcessor(async (event) =>
        Sentry.addRequestDataToEvent(event, req),
      );
      Sentry.captureException(err.originalError ?? err);
    });
    res.status(err.code).send(err.message);
  } else {
    res.status(500).send(`Internal Server Error: ${(res as any).sentry}`);
  }
  next(err);
};
