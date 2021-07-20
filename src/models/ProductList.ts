import {objectType} from 'nexus';
import Billable from './Billable';

export default objectType({
  name: 'ProductList',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.emoji();
    t.model.product({
      ordering: {
        order: true,
      },
    });
    t.implements(Billable);
  },
});
