import {UserInputError} from 'apollo-server-express';
import {extendType, nonNull} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('rateBandApplication', {
      type: 'BandApplication',
      args: {
        bandApplicationId: nonNull('ID'),
        rating: 'Int',
      },
      authorize: authorization('user'),
      resolve: async (_, {bandApplicationId, rating}, {prisma, token}) => {
        if (token?.type !== 'user' || !token.userId) {
          throw new UserInputError('Wrong token');
        }

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
          const {bandApplication} = await prisma.bandApplicationRating.delete({
            where,
            include,
          });
          return bandApplication;
        } else if (rating < 1 || rating > 4) {
          throw new UserInputError('Rating must be between 1 and 4');
        } else {
          const {bandApplication} = await prisma.bandApplicationRating.upsert({
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
    });
  },
});
