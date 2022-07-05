import {extendType} from 'nexus';
import Transactionable from '../models/Transactionable';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.implements(Transactionable);
  },
});
