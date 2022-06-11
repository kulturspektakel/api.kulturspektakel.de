import {list, nonNull, objectType} from 'nexus';
import Billable from './Billable';
import {Device as D} from 'nexus-prisma';

export default objectType({
  name: 'Device',
  definition(t) {
    t.field(D.id);
    t.implements(Billable);
    t.field(D.productList);
    t.field(D.lastSeen);
    t.field('cardTransactions', {
      type: nonNull(list(nonNull('CardTransaction'))),
      args: {
        limit: 'Int',
      },
      resolve: ({id}, {limit}, {prisma}) =>
        prisma.cardTransaction.findMany({
          where: {
            deviceId: id,
          },
          orderBy: {
            deviceTime: 'desc',
          },
          take: limit ?? 50,
        }),
    });
    t.field(D.softwareVersion);
  },
});
