import {objectType} from 'nexus';
import {MonotonicCounter} from 'nexus-prisma';

export default objectType({
  name: 'MonotonicCounter',
  definition(t) {
    t.field(MonotonicCounter.id);
    t.field(MonotonicCounter.value);
    t.field(MonotonicCounter.updatedAt);
  },
});
