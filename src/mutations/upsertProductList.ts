import {extendType, list, inputObjectType, nonNull} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('upsertProductList', {
      type: 'ProductList',
      args: {
        id: 'Int',
        name: 'String',
        emoji: 'String',
        products: list(
          nonNull(
            inputObjectType({
              name: 'ProductInput',
              definition: (t) => {
                t.nonNull.field('name', {type: 'String'});
                t.nonNull.field('price', {type: 'Int'});
                t.field('requiresDeposit', {type: 'Boolean'});
              },
            }),
          ),
        ),
      },
      authorize: authorization('user'),
      resolve: async (_, {id, name, emoji, products}, {prismaClient}) =>
        prismaClient.productList.upsert({
          create: {
            name: name ?? '',
            emoji,
            product: {
              createMany: {
                data:
                  products?.map((p, order) => ({
                    ...p,
                    order,
                    requiresDeposit: p.requiresDeposit ?? false,
                  })) ?? [],
              },
            },
          },
          update: {
            name: name ?? undefined,
            emoji,
            product: products
              ? {
                  deleteMany: {
                    productListId: id ?? -1,
                  },
                  createMany: {
                    data: products.map((p, order) => ({
                      ...p,
                      order,
                      requiresDeposit: p.requiresDeposit ?? false,
                    })),
                  },
                }
              : undefined,
          },
          where: {
            id: id ?? -1,
          },
          include: {
            product: true,
          },
        }),
    });
  },
});
