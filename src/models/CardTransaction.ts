import {interfaceType, nonNull, objectType} from 'nexus';
import {CardTransaction} from 'nexus-prisma';
import {builder} from '../pothos/builder';
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

// export const Transaction = interfaceType({
//   name: 'Transaction',
//   resolveType: (t) => {
//     if ('numberOfMissingTransactions' in t) {
//       return 'MissingTransaction';
//     }
//     return 'CardTransaction';
//   },
//   definition(t) {
//     t.field('depositAfter', {type: nonNull('Int')});
//     t.field('depositBefore', {type: nonNull('Int')});
//     t.field('balanceAfter', {type: nonNull('Int')});
//     t.field('balanceBefore', {type: nonNull('Int')});
//   },
// });

builder.prismaNode('CardTransaction', {
  fields: (t) => ({
    clientId: t.exposeString('clientId'),
    cardId: t.exposeString('cardId'),
    createdAt: t.exposeString('createdAt'),
    deviceTime: t.exposeString('deviceTime'),
    transactionType: t.exposeString('transactionType'),
    Order: t.exposeString('Order'),
  }),
});

export class Transaction {}

builder.interfaceType(Transaction, {
  name: 'Transaction',
  fields: (t) => ({
    depositAfter: t.field({type: 'Int'}),
    depositBefore: t.field({type: 'Int'}),
    balanceAfter: t.field({type: 'Int'}),
    balanceBefore: t.field({type: 'Int'}),
  }),
});
