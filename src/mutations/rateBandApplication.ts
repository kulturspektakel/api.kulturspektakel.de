import {UserInputError} from 'apollo-server-express';
import BandApplication from '../models/BandApplication';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.mutationField('rateBandApplication', (t) =>
  t.field({
    type: BandApplication,
    args: {
      bandApplicationId: t.arg.id({required: true}),
      rating: t.arg.int(),
    },
    resolve: async (_, {bandApplicationId, rating}, {token}) => {
      if (token?.type !== 'user' || !token.userId) {
        throw new UserInputError('Wrong token');
      }
      bandApplicationId = String(bandApplicationId);

      const where = {
        viewerId_bandApplicationId: {
          bandApplicationId,
          viewerId: token.userId,
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
        throw new UserInputError('Rating must be between 1 and 4');
      } else {
        const {bandApplication} =
          await prismaClient.bandApplicationRating.upsert({
            create: {
              rating,
              viewerId: token.userId,
              bandApplicationId,
            },
            update: {
              rating,
              viewerId: token.userId,
            },
            where,
            include,
          });
        return bandApplication;
      }
    },
  }),
);
