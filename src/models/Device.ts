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
    t.field(D.softwareVersion);
    t.field('transactions', {
      type: nonNull(
        objectType({
          name: 'CardTransactionConnection',
          definition(t) {
            t.field('balanceTotal', {
              type: nonNull('Int'),
            });
            t.field('depositTotal', {
              type: nonNull('Int'),
            });
            t.field('data', {
              type: nonNull(list(nonNull('CardTransaction'))),
            });
          },
        }),
      ),
      args: {
        limit: 'Int',
        after: 'DateTime',
        before: 'DateTime',
        type: 'CardTransactionType',
      },
      resolve: async (device, {limit, after, before, type}, {prisma}) => {
        const data = await prisma.cardTransaction.findMany({
          where: {
            deviceId: (device as Device).id,
            deviceTime: {
              gt: after,
              lt: before,
            },
            transactionType: type ?? undefined,
          },
          orderBy: {
            deviceTime: 'desc',
          },
          take: limit ?? undefined,
        });

        data.reduce((acc, cv) => acc + (cv.depositAfter - cv.depositBefore), 0);

        return {
          balanceTotal: data.reduce(
            (acc, cv) => acc + (cv.balanceAfter - cv.balanceBefore),
            0,
          ),
          depositTotal: data.reduce(
            (acc, cv) => acc + (cv.depositAfter - cv.depositBefore),
            0,
          ),
          data,
        };
      },
    });
  },
});
