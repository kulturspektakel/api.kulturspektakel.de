import {Transactionable} from '../models/Transactionable';
import {builder} from '../pothos/builder';

const Transactions = builder.objectRef<{}>('Transactions').implement({
  interfaces: [Transactionable],
});

builder.queryField('transactions', (t) =>
  t.field({
    type: Transactions,
    resolve: () => ({}),
  }),
);
