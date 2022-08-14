import {Billable} from './Billable';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

class HistoricalProduct implements Billable {
  name: string;
  productListId: number;
  constructor(name: string, productListId: number) {
    this.name = name;
    this.productListId = productListId;
  }
}

builder.objectType(HistoricalProduct, {
  name: 'HistoricalProduct',
  fields: (t) => ({
    name: t.field({type: 'String', resolve: ({name}) => name}),
    productListId: t.field({
      type: 'ID',
      resolve: ({productListId}) => productListId,
    }),
  }),
});

builder.prismaNode('ProductList', {
  id: {field: 'id'},
  interfaces: [Billable],
  fields: (t) => ({
    name: t.exposeString('name'),
    emoji: t.exposeString('emoji'),
    active: t.exposeBoolean('active'),
    product: t.relation('product', {
      query: () => ({
        orderBy: {
          order: 'asc',
        },
      }),
    }),
    historicalProducts: t.field({
      type: [HistoricalProduct],
      // TODO auth
      resolve: async ({id}) => {
        const products = await prismaClient.orderItem.groupBy({
          where: {
            productListId: id,
          },
          by: ['name'],
        });

        return products.map((p) => new HistoricalProduct(p.name, id));
      },
    }),
  }),
});
