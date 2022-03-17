import {PluginDefinition} from 'apollo-server-core';
import {ErrorMessage, ErrorReporting} from '@google-cloud/error-reporting';
import env from './env';
import {ErrorRequestHandler} from 'express';

const localReporter: ErrorReporting['report'] = (error, req, message, cb) => {
  console.error(error, message);
  if (typeof cb === 'function') {
    cb(null, null, {});
  }
  return new ErrorMessage();
};

export const errorReporter =
  env.NODE_ENV === 'production'
    ? new ErrorReporting({
        reportMode: 'production',
        reportUnhandledRejections: true,
      })
    : {
        report: localReporter,
      };

export const ApolloErrorLoggingPlugin: PluginDefinition = {
  async requestDidStart() {
    return {
      async didEncounterErrors({logger, errors, request: {http}}) {
        await Promise.all(
          errors.map((e) => {
            return new Promise((resolve, reject) => {
              errorReporter.report(e, http, undefined, (err, response) => {
                if (err) {
                  return reject(err);
                }
                return resolve(response);
              });
            });
          }),
        );
        return;
      },
    };
  },
};

export class ApiError extends Error {
  message: string;
  code: number;
  originalError?: Error;

  constructor(code: number, message: string, originalError?: Error) {
    super();
    this.code = code;
    this.message = message;
    this.originalError = originalError;
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
    res.status(err.code).send(err.message);
    if (err.originalError) {
      err = err.originalError;
    }
  } else {
    res.status(500).send('Internal Server Error');
  }

  errorReporter.report(err, req, undefined, (e) => {
    if (e) {
      console.error(e);
    }
    next();
  });
};
