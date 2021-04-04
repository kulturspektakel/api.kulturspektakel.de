import {extendType, idArg, nonNull} from 'nexus';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('area', {
      type: 'Area',
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_root, {id}, {prismaClient}) =>
        await prismaClient.area.findUnique({where: {id}}),
    });
  },
});
