import {builder} from '../pothos/builder';
import {Transactionable} from './Transactionable';

class Card {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

builder.node(Card, {
  name: 'Card',
  authScopes: {
    user: true,
  },
  id: {
    resolve: ({id}) => id,
  },
  interfaces: [Transactionable],
});
