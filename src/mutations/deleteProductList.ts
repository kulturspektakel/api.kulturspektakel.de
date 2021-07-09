import {extendType, nonNull} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('deleteProductList', {
      type: 'Boolean',
      args: {
        id: nonNull('Int'),
      },
      authorize: authorization('user'),
      resolve: async (_, {id}, {prismaClient}) =>
        prismaClient.productList
          .delete({
            where: {
              id,
            },
          })
          .then((a) => Boolean(a)),
    });
  },
});
