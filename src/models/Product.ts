import {objectType} from 'nexus';
import Billable from './Billable';

export default objectType({
  name: 'Product',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.price();
    t.model.requiresDeposit();
    t.implements(Billable);
  },
});
