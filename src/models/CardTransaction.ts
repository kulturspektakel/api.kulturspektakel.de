import {interfaceType, nonNull, objectType} from 'nexus';
import {CardTransaction} from 'nexus-prisma';
import {config} from '../queries/config';

export default objectType({
  name: 'CardTransaction',
  definition(t) {
    t.implements(Transaction);
    t.field(CardTransaction.clientId);
    t.field(CardTransaction.cardId);
    t.field(CardTransaction.createdAt);
    t.field(CardTransaction.deviceTime);
    t.field(CardTransaction.transactionType);
    t.field(CardTransaction.Order);
  },
});

export const Transaction = interfaceType({
  name: 'Transaction',
  resolveType: (t) => {},
  definition(t) {
    t.field('depositAfter', {type: nonNull('Int')});
    t.field('depositBefore', {type: nonNull('Int')});
    t.field('balanceAfter', {type: nonNull('Int')});
    t.field('balanceBefore', {type: nonNull('Int')});
    t.field('total', {
      description:
        'Total transaction amount, including deposit. Negative values indicate top ups/deposit returns.',
      type: 'Int',
      resolve: ({depositAfter, depositBefore, balanceAfter, balanceBefore}) =>
        balanceBefore -
        balanceAfter -
        (depositBefore - depositAfter) * config.depositValue,
    });
  },
});
