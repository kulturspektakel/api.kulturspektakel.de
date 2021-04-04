import {extendType} from 'nexus';
import requireAuthorization from '../utils/requireAuthorization';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('viewer', {
      type: 'Viewer',
      ...requireAuthorization,
      resolve: async (_root, _args, {prismaClient, userId}) => {
        if (!userId) {
          return null;
        }
        return prismaClient.viewer.findUnique({
          where: {
            id: userId,
          },
        });
      },
    });
  },
});
