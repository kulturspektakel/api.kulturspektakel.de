import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import ProductList from '../models/ProductList';

builder.queryField('productLists', (t) =>
  t.prismaField({
    type: [ProductList],
    resolve: (query) =>
      prismaClient.productList.findMany({
        ...query,
        orderBy: {
          name: 'asc',
        },
      }),
  }),
);
