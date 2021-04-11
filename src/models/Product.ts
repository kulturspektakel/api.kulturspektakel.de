import {objectType} from 'nexus';
import Node from './Node';

export default objectType({
  name: 'Product',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.price();
  },
});
