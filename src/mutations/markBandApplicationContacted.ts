import {extendType, nonNull, booleanArg, idArg} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('markBandApplicationContacted', {
      type: 'BandApplication',
      args: {
        bandApplicationId: nonNull(idArg()),
        contacted: nonNull(booleanArg()),
      },
      authorize: authorization('user'),
      resolve: async (_, {contacted, bandApplicationId}, {prisma, token}) =>
        prisma.bandApplication.update({
          data: {
            contactedByViewerId:
              contacted && token?.type === 'user' ? token.userId : null,
          },
          where: {
            id: bandApplicationId,
          },
        }),
    });
  },
});
