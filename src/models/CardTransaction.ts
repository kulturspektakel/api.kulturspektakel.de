import {builder} from '../pothos/builder';
import {CardTransactionType as CardTransactionTypeValues} from '@prisma/client';
import {Transactionable} from './Transactionable';

export class Transaction implements Transactionable {}

export const CardTransactionType = builder.enumType('CardTransactionType', {
  values: Object.values(CardTransactionTypeValues),
});

export default builder.prismaObject('CardTransaction', {
  interfaces: [Transaction],
  fields: (t) => ({
    clientId: t.exposeString('clientId'),
    cardId: t.exposeString('cardId'),
    createdAt: t.expose('createdAt', {type: 'DateTime'}),
    deviceTime: t.expose('deviceTime', {type: 'DateTime'}),
    transactionType: t.expose('transactionType', {type: CardTransactionType}),
    Order: t.relation('Order'),
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

builder
  .objectRef<{
    numberOfMissingTransactions: number;
  }>('MissingTransaction')
  .implement({
    interfaces: [Transaction],
    fields: (t) => ({
      numberOfMissingTransactions: t.exposeInt('numberOfMissingTransactions'),
    }),
  });
