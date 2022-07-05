import {objectType} from 'nexus';

export default objectType({
  name: 'Band',
  definition(t) {
    t.nonNull.field('id', {
      type: 'ID',
    });
    t.nonNull.field('name', {
      type: 'String',
    });
    t.field('genre', {
      type: 'String',
    });
    t.nonNull.field('startTime', {
      type: 'DateTime',
    });
    t.nonNull.field('endTime', {
      type: 'DateTime',
    });
    t.field('description', {
      type: 'String',
    });
  },
});
