import {PluginDefinition} from 'apollo-server-core';
import {ErrorRequestHandler} from 'express';
import * as Sentry from '@sentry/node';

export const ApolloErrorLoggingPlugin: PluginDefinition = {
  async requestDidStart() {
    return {
      async didEncounterErrors(ctx) {
        for (const err of ctx.errors) {
          Sentry.withScope((scope) => {
            scope.setTag(
              'kind',
              ctx.operation?.operation ?? 'Invalid operation',
            );
            scope.setExtra('query', ctx.request.query);
            scope.setExtra('variables', ctx.request.variables);
            if (err.path) {
              scope.addBreadcrumb({
                category: 'query-path',
                message: err.path.join(' → '),
                level: 'debug',
              });
            }
            Sentry.captureException(err);
          });
        }
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
        Sentry.Handlers.parseRequest(event, req),
      );
      Sentry.captureException(err.originalError ?? err);
    });
    res.status(err.code).send(err.message);
  } else {
    res.status(500).send(`Internal Server Error: ${(res as any).sentry}`);
  }
  next(err);
};
