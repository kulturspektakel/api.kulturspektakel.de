import {extendType, nonNull, stringArg} from 'nexus';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('reservationForToken', {
      type: 'Reservation',
      args: {
        token: nonNull(stringArg()),
      },
      resolve: async (_root, {token}, {prisma}) =>
        prisma.reservation.findUnique({
          where: {
            token,
          },
        }),
    });
  },
});
