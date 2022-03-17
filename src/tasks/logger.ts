import {Logger} from 'graphile-worker';
import {errorReporter} from '../utils/errorReporting';

export default new Logger((scope) => {
  return (level, message, meta) => {
    if (level === 'error') {
      errorReporter.report(
        [message, JSON.stringify(meta), JSON.stringify(scope)].join('\n'),
      );
    } else {
      console.log(level, message, scope, meta);
    }
  };
});
