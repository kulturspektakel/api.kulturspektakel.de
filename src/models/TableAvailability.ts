import {objectType} from 'nexus';

export default objectType({
  name: 'TableAvailability',
  definition(t) {
    t.nonNull.field('startTime', {
      type: 'DateTime',
    });
    t.nonNull.field('endTime', {
      type: 'DateTime',
    });
    t.nonNull.field('tableType', {
      type: 'TableType',
    });
  },
});
