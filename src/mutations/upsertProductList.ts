import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import ProductList from '../models/ProductList';

const ProductInput = builder.inputType('ProductInput', {
  fields: (t) => ({
    name: t.string({required: true}),
    price: t.int({required: true}),
    requiresDeposit: t.boolean({required: true}),
    additives: t.idList({required: true}),
  }),
});

builder.mutationField('upsertProductList', (t) =>
  t.field({
    authScopes: {user: true},
    type: ProductList,
    args: {
      id: t.arg.globalID(),
      name: t.arg.string(),
      emoji: t.arg.string(),
      active: t.arg.boolean(),
      products: t.arg({type: [ProductInput]}),
    },
    resolve: (_, {id: globalId, name, emoji, active, products}) =>
      prismaClient.$transaction(async (tx) => {
        const productListId = globalId ? parseInt(globalId.id, 10) : -1;
        const productList = await tx.productList.upsert({
          create: {
            name: name ?? '',
            emoji,
            active: active ?? undefined,
            product: {
              createMany: {
                data:
                  products?.map(({additives = [], ...p}, order) => ({
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
                    data: products.map(({additives = [], ...p}, order) => ({
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

        if (products) {
          await Promise.all(
            productList.product.map(async (product, i) =>
              tx.product.update({
                where: {
                  id: product.id,
                },
                data: {
                  additives: {
                    connect: products[i].additives!.map((id) => ({
                      id: String(id),
                    })),
                  },
                },
              }),
            ),
          );
        }

        if (active === false) {
          await tx.device.updateMany({
            where: {
              productListId,
            },
            data: {
              productListId: null,
            },
          });
        }

        return productList;
      }),
  }),
);
