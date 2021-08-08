import {extendType} from 'nexus';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('areas', {
      type: 'Area',
      resolve: (_root, _args, {prisma}) =>
        prisma.area.findMany({
          orderBy: {
            order: 'asc',
          },
        }),
    });
  },
});
