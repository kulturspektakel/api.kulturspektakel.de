import {extendType, nonNull, stringArg} from 'nexus';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('reservationsForToken', {
      type: 'Reservation',
      args: {
        token: nonNull(stringArg()),
      },
      resolve: async (_root, {token}, {prismaClient}) => {
        const reservation = await prismaClient.reservation.findUnique({
          where: {
            token,
          },
        });

        if (reservation == null) {
          return [];
        }

        return prismaClient.reservation.findMany({
          where: {
            primaryEmail: reservation?.primaryEmail,
          },
        });
      },
    });
  },
});
