import {extendType} from 'nexus';
import requireUserAuthorization from '../utils/requireUserAuthorization';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('viewer', {
      type: 'Viewer',
      ...requireUserAuthorization,
      resolve: async (_root, _args, {prismaClient, token}) => {
        if (token?.type !== 'user') {
          return null;
        }
        return prismaClient.viewer.findUnique({
          where: {
            id: token.userId,
          },
        });
      },
    });
  },
});
