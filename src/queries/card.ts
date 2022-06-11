import {sub} from 'date-fns';
import {extendType, list, nonNull, objectType} from 'nexus';
import {Transaction} from '../models/CardTransaction';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.field('availableCapacity', {
      type: objectType({
        name: 'CardStatus',
        definition(t) {
          t.field('balance', {
            type: nonNull('Int'),
          });
          t.field('deposit', {
            type: nonNull('Int'),
          });
          t.field('recentTransactions', {
            type: list(nonNull(Transaction)),
          });
        },
      }),
      args: {
        payload: nonNull('String'),
      },
      resolve: async (_parent, {payload}, {prisma}) => {
        const counter = null;
        const cardId = 'null';

        if (counter) {
          const transactions = await prisma.cardTransaction.findMany({
            where: {
              cardId,
              deviceTime: {
                gte: sub(new Date(), {days: 3}),
              },
              counter: {
                not: null,
              },
            },
            orderBy: {
              counter: 'desc',
            },
          });

          const recentTransactions = [];

          if (transactions.length > 0) {
            for (
              let c = transactions[transactions.length - 1].counter!;
              c <= counter;
              c++
            ) {}
          }
        }

        return {
          deposit: 0,
          balance: 0,
          recentTransactions,
        };
      },
    });
  },
});

const MissingTransaction = objectType({
  name: 'MissingTransaction',
  definition(t) {
    t.implements(Transaction);
    t.nonNull.field('numberOfMissingTransactions', {
      type: 'Int',
    });
  },
});
