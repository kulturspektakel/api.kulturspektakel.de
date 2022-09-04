import {Prisma, PrismaPromise} from '@prisma/client';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import ProductList from '../models/ProductList';
import {UserInputError} from 'apollo-server-express';

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
      id: t.arg({type: 'ID'}),
      name: t.arg({type: 'String'}),
      emoji: t.arg({type: 'String'}),
      active: t.arg({type: 'Boolean'}),
      products: t.arg({type: [ProductInput]}),
    },
    resolve: async (_, {id, name, emoji, active, products}) => {
      if (typeof id === 'string') {
        const [type, key] = id.split(':');
        if (type !== 'ProductList' || !/^\d+$/.test(key)) {
          throw new UserInputError('ID is invalid');
        }
        id = parseInt(key, 10);
      }

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
          prismaClient.device.updateMany({
            where: {
              productListId: id,
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
