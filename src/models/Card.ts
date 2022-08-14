import {builder} from '../pothos/builder';
import Transactionable from './Transactionable';

// export default objectType({
//   name: 'Card',
//   definition(t) {
//     t.implements(Node);
//     t.implements(Transactionable);
//   },
// });

builder.node('Card', {
  id: {field: 'id'},
  interfaces: [Transactionable],
});
