import {builder} from '../pothos/builder';
import {CardTransactionType as CardTransactionTypeValues} from '@prisma/client';
import {Transactionable} from './Transactionable';

type TransactionData = {
  depositAfter: number;
  depositBefore: number;
  balanceAfter: number;
  balanceBefore: number;
};

export class Transaction implements Transactionable {
  depositAfter: number;
  depositBefore: number;
  balanceAfter: number;
  balanceBefore: number;

  constructor({
    depositAfter,
    depositBefore,
    balanceAfter,
    balanceBefore,
  }: TransactionData) {
    this.depositAfter = depositAfter;
    this.depositBefore = depositBefore;
    this.balanceAfter = balanceAfter;
    this.balanceBefore = balanceBefore;
  }
}

export const CardTransactionType = builder.enumType('CardTransactionType', {
  values: Object.values(CardTransactionTypeValues),
});

export default builder.prismaObject('CardTransaction', {
  interfaces: [Transaction],
  include: {
    deviceLog: true,
  },
  fields: (t) => ({
    clientId: t.exposeString('clientId'),
    cardId: t.exposeString('cardId'),
    transactionType: t.expose('transactionType', {type: CardTransactionType}),
    Order: t.relation('Order'),
    deviceTime: t.field({
      type: 'DateTime',
      resolve: (parent) => parent.deviceLog?.deviceTime,
    }),
  }),
});

export const TransactionInterface = builder.interfaceType(Transaction, {
  name: 'Transaction',
  fields: (t) => ({
    depositAfter: t.exposeInt('depositAfter'),
    depositBefore: t.exposeInt('depositBefore'),
    balanceAfter: t.exposeInt('balanceAfter'),
    balanceBefore: t.exposeInt('balanceBefore'),
  }),
  resolveType: (t) =>
    t instanceof MissingTransaction ? 'MissingTransaction' : 'CardTransaction',
});

export class MissingTransaction extends Transaction {
  numberOfMissingTransactions: number;

  constructor(
    transactionData: TransactionData,
    numberOfMissingTransactions: number,
  ) {
    super(transactionData);
    this.numberOfMissingTransactions = numberOfMissingTransactions;
  }
}

builder.objectType(MissingTransaction, {
  name: 'MissingTransaction',
  interfaces: [Transaction],
  fields: (t) => ({
    numberOfMissingTransactions: t.exposeInt('numberOfMissingTransactions'),
  }),
});
