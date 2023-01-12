import {builder} from '../pothos/builder';
import {ApiError} from '../utils/errorReporting';
import prismaClient from '../utils/prismaClient';

builder.mutationField('deleteBandApplicationComment', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      id: t.arg.globalID({required: true}),
    },
    authScopes: {
      user: true,
    },
    resolve: async (_, {id}, {token}) => {
      const viewerId = token?.type === 'user' ? token.userId : undefined;
      if (!viewerId) {
        throw new ApiError(401, 'Must be user authenticated');
      }
      const del = await prismaClient.bandApplicationComment.deleteMany({
        where: {
          id: id.id,
          viewerId,
        },
      });

      return del.count === 1;
    },
  }),
);
