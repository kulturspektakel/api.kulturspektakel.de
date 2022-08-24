import Viewer from '../models/Viewer';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.queryField('viewer', (t) =>
  t.prismaField({
    type: Viewer,
    authScopes: {
      user: true,
    },
    nullable: true,
    resolve: (query, _root, _args, {token}) => {
      if (token?.type !== 'user') {
        return null;
      }
      return prismaClient.viewer.findUnique({
        ...query,
        where: {
          id: token.userId,
        },
      });
    },
  }),
);
