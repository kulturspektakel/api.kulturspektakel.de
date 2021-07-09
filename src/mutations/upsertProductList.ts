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
              },
            }),
          ),
        ),
      },
      authorize: authorization('user'),
      resolve: async (_, {id, name, emoji, products}, {prismaClient}) =>
        prismaClient.productList.upsert({
          create: {
            name: name!,
            emoji,

            product: {
              createMany: {
                data: products?.map((p, order) => ({...p, order})) ?? [],
              },
            },
          },
          update: {
            name: name ?? undefined,
            emoji,
            product: {
              deleteMany: id
                ? {
                    productListId: id,
                  }
                : undefined,
              createMany: {
                data: products?.map((p, order) => ({...p, order})) ?? [],
              },
            },
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
