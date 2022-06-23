import {list, nonNull, objectType} from 'nexus';
import Billable from './Billable';
import {Device as D} from 'nexus-prisma';
import {Device} from '@prisma/client';
import Node from './Node';

export default objectType({
  name: 'Device',
  definition(t) {
    t.implements(Node);
    t.implements(Billable);
    t.field(D.productList);
    t.field(D.lastSeen);
    t.field('recentTransactions', {
      type: nonNull(list(nonNull('CardTransaction'))),
      args: {
        limit: 'Int',
      },
      resolve: (device, {limit}, {prisma}) =>
        prisma.cardTransaction.findMany({
          where: {
            deviceId: (device as Device).id,
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
