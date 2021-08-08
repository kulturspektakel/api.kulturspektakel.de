import {objectType} from 'nexus';
import Billable from './Billable';
import {Device} from 'nexus-prisma';

export default objectType({
  name: 'Device',
  definition(t) {
    t.field(Device.id);
    t.implements(Billable);
    t.field(Device.productList);
    t.field(Device.lastSeen);
  },
});
