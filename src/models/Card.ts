import {objectType} from 'nexus';
import Node from './Node';
import Transactionable from './Transactionable';

export default objectType({
  name: 'Card',
  definition(t) {
    t.implements(Node);
    t.implements(Transactionable);
  },
});
