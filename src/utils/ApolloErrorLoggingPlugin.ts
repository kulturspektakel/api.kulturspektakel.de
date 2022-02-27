import {PluginDefinition} from 'apollo-server-core';
import {ErrorReporting} from '@google-cloud/error-reporting';
import env from './env';

const errorReporter = new ErrorReporting({
  credentials: JSON.parse(env.GOOGLE_APPLICATION_CREDENTIALS),
  reportMode: 'always',
});

const plugin: PluginDefinition = {
  async requestDidStart() {
    return {
      async didEncounterErrors({logger, errors, request: {http, ...request}}) {
        await Promise.all(
          errors.map((e) => {
            return new Promise((resolve, reject) => {
              logger.info(e);
              errorReporter.report(e, http, e.message, (err, response) => {
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

export default plugin;
