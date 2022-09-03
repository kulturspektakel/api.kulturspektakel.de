import {builder} from '../pothos/builder';
import {Transaction} from './CardTransaction';

export default builder
  .objectRef<{
    balance: number;
    cardId: string;
    deposit: number;
    hasNewerTransactions: boolean | null;
    recentTransactions: Transaction[] | null;
  }>('CardStatus')
  .implement({
    fields: (t) => ({
      balance: t.exposeInt('balance'),
      cardId: t.exposeID('cardId'),
      deposit: t.exposeInt('deposit'),
      hasNewerTransactions: t.exposeBoolean('hasNewerTransactions', {
        nullable: true,
      }),
      recentTransactions: t.expose('recentTransactions', {
        type: [Transaction],
        nullable: true,
      }),
    }),
  });
