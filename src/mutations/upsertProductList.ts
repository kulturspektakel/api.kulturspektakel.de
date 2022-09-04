import {Prisma, PrismaPromise} from '@prisma/client';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import ProductList from '../models/ProductList';

const ProductInput = builder.inputType('ProductInput', {
  fields: (t) => ({
    name: t.string({required: true}),
    price: t.int({required: true}),
    requiresDeposit: t.boolean(),
  }),
});

builder.mutationField('upsertProductList', (t) =>
  t.field({
    type: ProductList,
    args: {
      id: t.arg.globalID(),
      name: t.arg.string(),
      emoji: t.arg.string(),
      active: t.arg.boolean(),
      products: t.arg({type: [ProductInput]}),
    },
    resolve: async (_, {id: globalId, name, emoji, active, products}) => {
      const productListId = globalId ? parseInt(globalId.id, 10) : -1;

      const upsert = prismaClient.productList.upsert({
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
                  productListId,
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
          id: productListId,
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
          prismaClient.device.updateMany({
            where: {
              productListId,
            },
            data: {
              productListId: null,
            },
          }),
        );
      }

      return prismaClient.$transaction(transactions).then(([data]) => data);
    },
  }),
);
