import {UserInputError} from 'apollo-server-express';
import BandApplication from '../models/BandApplication';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import viewerIdFromToken from '../utils/viewerIdFromToken';

builder.mutationField('rateBandApplication', (t) =>
  t.field({
    type: BandApplication,
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
        throw new UserInputError('Wrong token');
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
        throw new UserInputError('Rating must be between 1 and 4');
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
