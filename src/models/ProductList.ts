import {nonNull, objectType} from 'nexus';
import authorization from '../utils/authorization';
import Billable from './Billable';
import {ProductList} from 'nexus-prisma';

export default objectType({
  name: 'ProductList',
  definition(t) {
    t.field(ProductList.id);
    t.field(ProductList.name);
    t.field(ProductList.emoji);
    t.field(ProductList.active);
    t.field({
      ...ProductList.product,
      resolve: ({id}, _, {prisma}) =>
        prisma.product.findMany({
          where: {
            productListId: id,
          },
          orderBy: {
            order: 'asc',
          },
        }),
    });
    t.nonNull.list.nonNull.field('historicalProducts', {
      type: objectType({
        name: 'HistoricalProduct',
        definition(t) {
          t.field('name', {
            type: nonNull('String'),
          });
          t.field('productListId', {
            type: nonNull('Int'),
          });
          t.implements(Billable);
        },
      }),
      authorize: authorization('user'),
      resolve: async ({id}, {}, {prisma}) => {
        const products = await prisma.orderItem.groupBy({
          where: {
            productListId: id,
          },
          by: ['name'],
        });

        return products.map((p) => ({
          name: p.name,
          productListId: id,
        }));
      },
    });
    t.implements(Billable);
  },
});
