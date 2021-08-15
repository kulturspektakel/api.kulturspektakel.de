import {extendType} from 'nexus';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('events', {
      type: 'Event',
      resolve: (_root, _args, {prisma}) =>
        prisma.event.findMany({
          orderBy: {
            start: 'desc',
          },
        }),
    });
  },
});
