import {builder} from '../pothos/builder';

builder.prismaObject('OrderItem', {
  fields: (t) => ({
    id: t.exposeID('id'),
    note: t.exposeString('note', {nullable: true}),
    amount: t.exposeInt('amount'),
    name: t.exposeString('name'),
    productList: t.relation('productList', {nullable: true}),
    perUnitPrice: t.exposeInt('perUnitPrice'),
  }),
});
