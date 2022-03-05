import {PluginDefinition} from 'apollo-server-core';
import {ErrorReporting} from '@google-cloud/error-reporting';
import env from './env';
import {ErrorRequestHandler} from 'express';

export const errorReporter = new ErrorReporting({
  credentials: JSON.parse(env.GOOGLE_APPLICATION_CREDENTIALS),
  reportMode: 'always',
  reportUnhandledRejections: true,
});

export const ApolloErrorLoggingPlugin: PluginDefinition = {
  async requestDidStart() {
    return {
      async didEncounterErrors({logger, errors, request: {http}}) {
        await Promise.all(
          errors.map((e) => {
            return new Promise((resolve, reject) => {
              logger.info(e);
              errorReporter.report(e, http, undefined, (err, response) => {
                if (err) {
                  logger.error(err);
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
  }
}

export const errorReportingMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let originalError;
  console.log('asss');
  if (err instanceof ApiError) {
    res.status(err.code).text(err.message);
    originalError = err.message;
  } else {
    res.status(500).text('Internal Server Error');
  }

  errorReporter.report(originalError ?? err, req, undefined, (e, response) => {
    if (e) {
      console.error(e);
    }
    next();
  });
};
