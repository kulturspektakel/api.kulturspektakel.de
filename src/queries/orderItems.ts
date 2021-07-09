import {extendType} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('orderItems', {
      authorize: authorization('user'),
      type: 'OrderItem',
      args: {
        from: 'DateTime',
        until: 'DateTime',
      },
      resolve: async (_root, {from, until}, {prismaClient}) =>
        await prismaClient.orderItem.findMany({
          where: {
            order: {
              createdAt: {
                gte: from,
                lte: until,
              },
            },
          },
        }),
    });
  },
});
