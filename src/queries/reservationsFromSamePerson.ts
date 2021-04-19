import {Reservation} from '@prisma/client';
import {extendType} from 'nexus';

export default extendType({
  type: 'Reservation',
  definition: (t) => {
    t.nonNull.list.nonNull.field('reservationsFromSamePerson', {
      type: 'Reservation',
      resolve: async (parent, _args, {prismaClient}) => {
        if (parent.status !== 'Confirmed') {
          return [];
        }
        return prismaClient.reservation.findMany({
          where: {
            primaryEmail: (parent as Reservation).primaryEmail,
            status: 'Confirmed',
            id: {
              not: parent.id,
            },
          },
        });
      },
    });
  },
});
