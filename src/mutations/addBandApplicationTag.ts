import {GraphQLError} from 'graphql';
import BandApplication from '../models/BandApplication';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import viewerIdFromToken from '../utils/viewerIdFromToken';

builder.mutationField('addBandApplicationTag', (t) =>
  t.field({
    type: BandApplication,
    args: {
      bandApplicationId: t.arg.id({required: true}),
      tag: t.arg.string({required: true}),
    },
    authScopes: {user: true},
    resolve: async (_, {bandApplicationId, tag}, {parsedToken}) => {
      const viewerId = await viewerIdFromToken(parsedToken);
      if (viewerId == null) {
        throw new GraphQLError('Wrong token');
      }

      const data = await prismaClient.bandApplicationTag.create({
        data: {
          bandApplicationId,
          tag,
          createdByViewerId: viewerId,
        },
        select: {
          bandApplication: true,
        },
      });
      return data.bandApplication;
    },
  }),
);
