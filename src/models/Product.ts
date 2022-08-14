import {builder} from '../pothos/builder';
import {Billable} from './Billable';

builder.prismaNode('Product', {
  id: {field: 'id'},
  interfaces: [Billable],
  fields: (t) => ({
    name: t.exposeString('name'),
    price: t.exposeInt('price'),
    requiresDeposit: t.exposeBoolean('requiresDeposit'),
    productListId: t.exposeID('productListId'),
  }),
});
