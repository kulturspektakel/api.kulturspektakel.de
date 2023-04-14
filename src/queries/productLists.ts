import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import ProductList from '../models/ProductList';

const orderBy = {
  name: 'asc' as const,
};

builder.queryField('productLists', (t) =>
  t.prismaField({
    type: [ProductList],
    args: {
      activeOnly: t.arg.boolean(),
    },
    unauthorizedResolver: (query) =>
      prismaClient.productList.findMany({
        ...query,
        orderBy,
        where: {
          active: true,
        },
      }),
    resolve: (query, root, {activeOnly}) => {
      return prismaClient.productList.findMany({
        ...query,
        orderBy,
        where: activeOnly
          ? {
              active: true,
            }
          : undefined,
      });
    },
  }),
);
