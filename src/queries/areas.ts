import {extendType} from 'nexus';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('areas', {
      type: 'Area',
      resolve: async (_root, _args, {prismaClient}) =>
        await prismaClient.area.findMany({}),
    });
  },
});
