import {objectType} from 'nexus';
import Billable from './Billable';
import {Device as D} from 'nexus-prisma';
import Node from './Node';
import Transactionable from './Transactionable';

export default objectType({
  name: 'Device',
  definition(t) {
    t.implements(Node);
    t.implements(Billable);
    t.implements(Transactionable);
    t.field(D.productList);
    t.field(D.lastSeen);
    t.field(D.softwareVersion);
  },
});
