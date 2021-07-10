import {objectType} from 'nexus';

export default objectType({
  name: 'OrderItem',
  definition(t) {
    t.model.id();
    t.model.note();
    t.model.amount();
    t.model.name();
    t.model.list();
  },
});
