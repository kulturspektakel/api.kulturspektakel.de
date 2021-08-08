import {Reservation} from '@prisma/client';
import {extendType, objectType} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('reservationsByPerson', {
      // authorize: authorization('user'),
      type: objectType({
        name: 'ReservationByPerson',
        definition: (t) => {
          t.nonNull.field('email', {
            type: 'String',
          });
          t.nonNull.list.nonNull.field('reservations', {
            type: 'Reservation',
          });
        },
      }),
      resolve: async (_root, _args, {prisma}) => {
        const reservations = await prisma.reservation.findMany({
          where: {
            status: {
              in: ['Confirmed', 'CheckedIn'],
            },
          },
          orderBy: {
            startTime: 'asc',
          },
        });

        return Array.from(
          reservations
            .reduce((acc, cv) => {
              if (!acc.has(cv.primaryEmail)) {
                return acc.set(cv.primaryEmail, [cv]);
              }
              acc.get(cv.primaryEmail)!.push(cv);
              return acc;
            }, new Map<string, Reservation[]>())
            .entries(),
        ).map(([email, reservations]) => ({
          email,
          reservations,
        }));
      },
    });
  },
});
