import {extendType, nonNull} from 'nexus';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('productList', {
      type: 'ProductList',
      args: {
        id: nonNull('Int'),
      },
      resolve: (_root, {id}, {prisma}) =>
        prisma.productList.findUnique({
          where: {
            id,
          },
        }),
    });
  },
});
