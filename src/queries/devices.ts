import {extendType} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('devices', {
      type: 'Device',
      authorize: authorization('user'),
      resolve: async (_root, _args, {prismaClient}) =>
        prismaClient.device.findMany({}),
    });
  },
});
