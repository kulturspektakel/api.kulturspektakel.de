import {objectType} from 'nexus';
import Billable from './Billable';
import {Product} from 'nexus-prisma';

export default objectType({
  name: 'Product',
  definition(t) {
    t.field(Product.id);
    t.field(Product.name);
    t.field(Product.price);
    t.field(Product.requiresDeposit);
    t.field(Product.productListId);
    t.implements(Billable);
  },
});
