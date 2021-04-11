import {objectType} from 'nexus';
import Node from './Node';

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
  },
});
