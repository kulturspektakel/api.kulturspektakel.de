import {extendType} from 'nexus';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('productLists', {
      type: 'ProductList',
      resolve: (_root, _args, {prisma}) =>
        prisma.productList.findMany({
          orderBy: {
            name: 'asc',
          },
        }),
    });
  },
});
