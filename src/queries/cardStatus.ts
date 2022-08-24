import {sub} from 'date-fns';
import {extendType, list, nonNull, objectType} from 'nexus';
import {Transaction} from '../models/CardTransaction';
import {parsePayload} from '../utils/contactless';
import {NexusGenObjects} from '../../types/api';

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
          t.field('hasNewerTransactions', {
            type: 'Boolean',
          });
        },
      }),
      resolve: async (_parent, {payload}, {prisma}) => {
        const data = parsePayload(payload);

        let recentTransactions = null;
        let hasNewerTransactions = null;
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

          const startCounter = transactions.findIndex(
            (t) => t.counter === data.counter,
          );
          if (startCounter > 0) {
            hasNewerTransactions = true;
            transactions.splice(0, startCounter);
          } else {
            hasNewerTransactions = false;
          }

          // remove everything before last cashout
          const cashout = transactions.findIndex(
            (t) => t.transactionType === 'Cashout',
          );
          if (cashout > -1) {
            transactions.length = cashout + 1;
            transactions.pop();
          }

          if (transactions.length > 0) {
            let ti = 0;
            let numberOfMissingTransactions = 0;
            let deposit = data.deposit;
            let balance = data.balance;
            for (
              let c = data.counter;
              c >= transactions[transactions.length - 1].counter!;
              c--
            ) {
              if (transactions[ti].counter! === c) {
                if (numberOfMissingTransactions > 0) {
                  const missingTransaction: NexusGenObjects['MissingTransaction'] =
                    {
                      depositAfter: deposit,
                      balanceAfter: balance,
                      depositBefore: transactions[ti].depositAfter,
                      balanceBefore: transactions[ti].balanceAfter,
                      numberOfMissingTransactions,
                    };
                  recentTransactions.push(missingTransaction);
                  numberOfMissingTransactions = 0;
                }
                deposit = transactions[ti].depositBefore;
                balance = transactions[ti].balanceBefore;
                recentTransactions.push(transactions[ti]);
                ti++;
              } else {
                numberOfMissingTransactions++;
              }
            }
          }
        }

        return {
          deposit: data.deposit,
          balance: data.balance,
          cardId: data.cardId,
          recentTransactions,
          hasNewerTransactions,
        };
      },
    });
  },
});
