import {objectType} from 'nexus';
import Billable from './Billable';

export default objectType({
  name: 'Device',
  definition(t) {
    t.model.id();
    t.implements(Billable);
    t.model.productList();
    t.model.lastSeen();
  },
});
