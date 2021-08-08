import {Reservation} from '@prisma/client';
import {extendType} from 'nexus';

export default extendType({
  type: 'Reservation',
  definition: (t) => {
    t.nonNull.list.nonNull.field('reservationsFromSamePerson', {
      type: 'Reservation',
      resolve: async (parent, _args, {prisma}) => {
        if (parent.status !== 'Confirmed') {
          return [];
        }
        return prisma.reservation.findMany({
          where: {
            primaryEmail: (parent as Reservation).primaryEmail,
            status: {
              in: ['Confirmed', 'CheckedIn'],
            },
            id: {
              not: parent.id,
            },
          },
          orderBy: {
            startTime: 'asc',
          },
        });
      },
    });
  },
});
