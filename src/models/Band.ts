import {objectType} from 'nexus';

export default objectType({
  name: 'Band',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.genre();
    t.model.startTime();
    t.model.endTime();
  },
});
