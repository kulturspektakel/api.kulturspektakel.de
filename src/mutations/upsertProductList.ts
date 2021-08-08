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
        active: 'Boolean',
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
      resolve: async (_, {id, name, emoji, products, active}, {prisma}) =>
        prisma.productList.upsert({
          create: {
            name: name ?? '',
            emoji,
            active: active ?? undefined,
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
            active: active ?? undefined,
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
