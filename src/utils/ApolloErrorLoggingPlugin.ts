import {PluginDefinition} from 'apollo-server-core';

const plugin: PluginDefinition = {
  async requestDidStart() {
    return {
      async didEncounterErrors({logger, errors, request: {http, ...request}}) {
        logger.error({errors, request});
        return;
      },
    };
  },
};

export default plugin;
