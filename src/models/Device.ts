import {Transactionable} from './Transactionable';
import {builder} from '../pothos/builder';
import {Billable} from './Billable';

export default builder.prismaNode('Device', {
  id: {field: 'id'},
  interfaces: [Billable, Transactionable],
  // authScopes: {
  //   user: true,
  // },
  fields: (t) => ({
    lastSeen: t.expose('lastSeen', {type: 'DateTime', nullable: true}),
    softwareVersion: t.exposeString('softwareVersion', {nullable: true}),
    productList: t.relation('productList'),
  }),
});
