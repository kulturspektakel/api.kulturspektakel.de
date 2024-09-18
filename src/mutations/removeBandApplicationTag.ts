import {GraphQLError} from 'graphql';
import BandApplication from '../models/BandApplication';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import viewerIdFromToken from '../utils/viewerIdFromToken';

builder.mutationField('removeBandApplicationTag', (t) =>
  t.field({
    type: BandApplication,
    args: {
      bandApplicationId: t.arg.globalID({required: true}),
      tag: t.arg.string({required: true}),
    },
    authScopes: {user: true},
    resolve: async (_, {bandApplicationId, tag}, {parsedToken}) => {
      const viewerId = await viewerIdFromToken(parsedToken);
      if (viewerId == null) {
        throw new GraphQLError('Wrong token');
      }

      const data = await prismaClient.bandApplicationTag.delete({
        where: {
          bandApplicationId_tag: {
            bandApplicationId: bandApplicationId.id,
            tag,
          },
        },
        select: {
          bandApplication: true,
        },
      });
      return data.bandApplication;
    },
  }),
);
