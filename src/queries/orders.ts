import {extendType} from 'nexus';
import requireDeviceAuthorization from '../utils/requireDeviceAuthorization';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('orders', {
      ...requireDeviceAuthorization,
      type: 'Order',
      resolve: async (_root, _args, {prismaClient}) =>
        await prismaClient.order.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        }),
    });
  },
});
