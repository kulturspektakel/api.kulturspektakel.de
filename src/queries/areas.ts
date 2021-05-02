import {extendType} from 'nexus';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('areas', {
      type: 'Area',
      resolve: async (_root, _args, {prismaClient}) =>
        await prismaClient.area.findMany({
          orderBy: {
            order: 'asc',
          },
        }),
    });
  },
});
