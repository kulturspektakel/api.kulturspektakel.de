import {objectType} from 'nexus';

export default objectType({
  name: 'Availability',
  definition(t) {
    t.nonNull.field('startTime', {
      type: 'DateTime',
    });

    t.nonNull.field('endTime', {
      type: 'DateTime',
    });
  },
});