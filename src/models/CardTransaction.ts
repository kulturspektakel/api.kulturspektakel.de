import {builder} from '../pothos/builder';

export class Transaction {}

builder.prismaObject('CardTransaction', {
  interfaces: [Transaction],
  fields: (t) => ({
    clientId: t.exposeString('clientId'),
    cardId: t.exposeString('cardId'),
    createdAt: t.exposeString('createdAt'),
    deviceTime: t.exposeString('deviceTime'),
    transactionType: t.exposeString('transactionType'),
    Order: t.exposeString('Order'),
  }),
});

builder.interfaceType(Transaction, {
  name: 'Transaction',
  fields: (t) => ({
    depositAfter: t.field({type: 'Int'}),
    depositBefore: t.field({type: 'Int'}),
    balanceAfter: t.field({type: 'Int'}),
    balanceBefore: t.field({type: 'Int'}),
  }),
});
