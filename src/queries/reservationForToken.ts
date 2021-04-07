import {extendType, nonNull, stringArg} from 'nexus';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('reservationForToken', {
      type: 'Reservation',
      args: {
        token: nonNull(stringArg()),
      },
      resolve: async (_root, {token}, {prismaClient}) =>
        prismaClient.reservation.findUnique({
          where: {
            token,
          },
        }),
    });
  },
});
