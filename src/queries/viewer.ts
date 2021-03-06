import {extendType} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('viewer', {
      type: 'Viewer',
      authorize: authorization('user'),
      resolve: async (_root, _args, {prisma, token}) => {
        if (token?.type !== 'user') {
          return null;
        }
        return prisma.viewer.findUnique({
          where: {
            id: token.userId,
          },
        });
      },
    });
  },
});
