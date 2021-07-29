import {nonNull, objectType} from 'nexus';
import authorization from '../utils/authorization';
import Billable from './Billable';

export default objectType({
  name: 'ProductList',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.emoji();
    t.model.product({
      ordering: {
        order: true,
      },
    });
    t.nonNull.list.nonNull.field('historicalProducts', {
      type: objectType({
        name: 'HistoricalProduct',
        definition(t) {
          t.field('name', {
            type: nonNull('String'),
          });
          t.implements(Billable);
        },
      }),
      authorize: authorization('user'),
      resolve: async ({id}, {}, {prismaClient}) => {
        const products = await prismaClient.orderItem.groupBy({
          where: {
            listId: id,
          },
          by: ['name'],
          _count: true,
          _sum: {
            perUnitPrice: true,
          },
        });

        return products.map((p) => ({
          name: p.name,
        }));
      },
    });
    t.implements(Billable);
  },
});
