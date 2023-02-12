import Viewer from '../models/Viewer';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import viewerIdFromToken from '../utils/viewerIdFromToken';

builder.queryField('viewer', (t) =>
  t.prismaField({
    type: Viewer,
    authScopes: {
      user: true,
    },
    nullable: true,
    resolve: async (query, _root, _args, {parsedToken}) => {
      const viewerId = await viewerIdFromToken(parsedToken);
      return prismaClient.viewer.findUnique({
        ...query,
        where: {
          id: viewerId!,
        },
      });
    },
  }),
);
