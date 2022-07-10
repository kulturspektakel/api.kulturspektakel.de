import {Prisma, PrismaPromise} from '@prisma/client';
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
      resolve: async (_, {id, name, emoji, products, active}, {prisma}) => {
        const upsert = prisma.productList.upsert({
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
            updatedAt: new Date(),
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
        });

        const transactions: [
          typeof upsert,
          ...PrismaPromise<Prisma.BatchPayload>[],
        ] = [upsert];

        if (active === false) {
          // remove from connected devices when product list is disabled
          transactions.push(
            prisma.device.updateMany({
              where: {
                productListId: id,
              },
              data: {
                productListId: null,
              },
            }),
          );
        }

        return prisma.$transaction(transactions).then(([data]) => data);
      },
    });
  },
});
