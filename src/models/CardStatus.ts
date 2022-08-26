import {builder} from '../pothos/builder';
import {Transaction} from './CardTransaction';

export default builder
  .objectRef<{
    balance: number;
    cardId: string;
    deposit: number;
    hasNewerTransactions: boolean;
    recentTransactions: Transaction[];
  }>('CardStatus')
  .implement({
    fields: (t) => ({
      balance: t.exposeInt('balance'),
      cardId: t.exposeString('cardId'),
      deposit: t.exposeInt('deposit'),
      hasNewerTransactions: t.exposeBoolean('hasNewerTransactions'),
      recentTransactions: t.expose('recentTransactions', {
        type: [Transaction],
      }),
    }),
  });
