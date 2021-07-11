import {extendType} from 'nexus';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('productLists', {
      type: 'ProductList',
      resolve: async (_root, _args, {prismaClient}) =>
        await prismaClient.productList.findMany({
          orderBy: {
            name: 'asc',
          },
        }),
    });
  },
});
