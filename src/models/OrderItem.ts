import {objectType} from 'nexus';
import {OrderItem} from 'nexus-prisma';

export default objectType({
  name: 'OrderItem',
  definition(t) {
    t.field(OrderItem.id);
    t.field(OrderItem.note);
    t.field(OrderItem.amount);
    t.field(OrderItem.name);
    t.field(OrderItem.productList);
    t.field(OrderItem.perUnitPrice);
  },
});
