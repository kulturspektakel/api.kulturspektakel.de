import {extendType} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('orders', {
      authorize: authorization('device'),
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
