import {extendType, stringArg, nonNull} from 'nexus';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('cancelReservation', {
      type: 'Boolean',
      args: {
        token: nonNull(stringArg()),
      },
      resolve: async (_, {token}, {prismaClient}) => {
        const reservation = await prismaClient.reservation.deleteMany({
          where: {
            token,
            status: 'Confirmed',
          },
        });

        return reservation.count > 0;
      },
    });
  },
});
