import {objectType} from 'nexus';

export default objectType({
  name: 'Table',
  definition(t) {
    t.model.displayName();
    t.model.maxCapacity();
    t.model.area({
      type: 'Area',
    });
  },
});
