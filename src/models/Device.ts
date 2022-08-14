import Transactionable from './Transactionable';
import {builder} from '../pothos/builder';
import {Billable} from './Billable';

builder.prismaNode('Device', {
  id: {field: 'id'},
  interfaces: [Billable, Transactionable],
  fields: (t) => ({
    lastSeen: t.expose('lastSeen', {type: 'DateTime', nullable: true}),
    softwareVersion: t.exposeString('softwareVersion', {nullable: true}),
    productList: t.relation('productList'),
  }),
});
