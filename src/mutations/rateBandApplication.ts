import BandApplication from '../models/BandApplication';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import viewerIdFromToken from '../utils/viewerIdFromToken';
import {GraphQLError} from 'graphql';

builder.mutationField('rateBandApplication', (t) =>
  t.field({
    type: BandApplication,
    authScopes: {user: true},
    args: {
      bandApplicationId: t.arg.globalID({required: true}),
      rating: t.arg.int(),
    },
    resolve: async (
      _,
      {bandApplicationId: {id: bandApplicationId}, rating},
      {parsedToken},
    ) => {
      const viewerId = await viewerIdFromToken(parsedToken);
      if (viewerId == null) {
        throw new GraphQLError('Wrong token');
      }

      const where = {
        viewerId_bandApplicationId: {
          bandApplicationId,
          viewerId,
        },
      };

      const include = {
        bandApplication: true,
      };

      if (rating == null) {
        const {bandApplication} =
          await prismaClient.bandApplicationRating.delete({
            where,
            include,
          });
        return bandApplication;
      } else if (rating < 1 || rating > 4) {
        throw new GraphQLError('Rating must be between 1 and 4');
      } else {
        const {bandApplication} =
          await prismaClient.bandApplicationRating.upsert({
            create: {
              rating,
              viewerId,
              bandApplicationId,
            },
            update: {
              rating,
              viewerId,
            },
            where,
            include,
          });
        return bandApplication;
      }
    },
  }),
);
