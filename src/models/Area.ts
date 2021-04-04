import {objectType} from 'nexus';

export default objectType({
  name: 'Area',
  definition(t) {
    t.model.id();
    t.model.displayName();
  },
});
