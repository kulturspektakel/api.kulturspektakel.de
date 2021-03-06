import {UserInputError} from 'apollo-server-express';
import {extendType, stringArg, nonNull} from 'nexus';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('cancelReservation', {
      type: 'Boolean',
      args: {
        token: nonNull(stringArg()),
      },
      resolve: async (_, {token}, {prisma, token: auth}) => {
        const reservation = await prisma.reservation.findUnique({
          where: {
            token,
          },
        });

        if (!reservation) {
          throw new UserInputError(
            'Reservierung konnte nicht gefunden werden.',
          );
        }
        if (auth?.type !== 'user' && reservation.status !== 'Confirmed') {
          // user can only clear confirmed reservations
          throw new UserInputError('Reservierung kann nicht gelöscht werden.');
        }

        await prisma.reservation.delete({
          where: {
            token,
          },
        });
        await prisma.clearedReservation.create({
          data: {
            id: reservation.id,
            data: JSON.stringify(reservation),
            clearedBy:
              auth?.type === 'user'
                ? {
                    connect: {
                      id: auth.userId,
                    },
                  }
                : undefined,
          },
        });

        return true;
      },
    });
  },
});
