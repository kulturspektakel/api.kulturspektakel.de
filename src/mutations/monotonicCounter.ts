import {extendType, nonNull} from 'nexus';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('monotonicCounter', {
      type: 'MonotonicCounter',
      args: {
        id: nonNull('ID'),
      },
      resolve: async (_, {id}, {prisma}) =>
        prisma.monotonicCounter.upsert({
          where: {id},
          create: {
            id,
          },
          update: {
            value: {
              increment: 1,
            },
          },
        }),
    });
  },
});
