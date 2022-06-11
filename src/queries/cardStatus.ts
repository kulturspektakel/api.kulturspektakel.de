import {UserInputError} from 'apollo-server-express';
import {sub} from 'date-fns';
import {extendType, list, nonNull, objectType} from 'nexus';
import {Transaction} from '../models/CardTransaction';
import {parsePayload} from '../utils/contactless';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.field('cardStatus', {
      args: {
        payload: nonNull('String'),
      },
      type: objectType({
        name: 'CardStatus',
        definition(t) {
          t.field('balance', {
            type: nonNull('Int'),
          });
          t.field('deposit', {
            type: nonNull('Int'),
          });
          t.field('cardId', {
            type: nonNull('ID'),
          });
          t.field('recentTransactions', {
            type: list(nonNull(Transaction)),
          });
        },
      }),
      resolve: async (_parent, {payload}, {prisma}) => {
        const data = parsePayload(payload);

        let recentTransactions = null;
        if (data.counter) {
          const transactions = await prisma.cardTransaction.findMany({
            where: {
              cardId: data.cardId,
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

          recentTransactions = [];

          // remove everything before last cashout
          const cashout = transactions.findIndex(
            (t) => t.transactionType === 'Cashout',
          );
          if (cashout > -1) {
            transactions.length = cashout;
            transactions.pop();
          }

          if (transactions.length > 0) {
            let ti = 0;
            let missing = 0;
            for (
              let c = data.counter!;
              c <= transactions[transactions.length - 1].counter!;
              c--
            ) {
              if (transactions[ti].counter! === c) {
                if (missing > 0) {
                  recentTransactions.push({
                    numberOfMissingTransactions: missing,
                  });
                  missing = 0;
                }
                recentTransactions.push(transactions[ti]);
                ti++;
              } else {
                missing++;
              }
            }
          }
        }

        return {
          deposit: data.deposit,
          balance: data.balance,
          cardId: data.cardId,
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
