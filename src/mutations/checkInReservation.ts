import {extendType, nonNull, intArg} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('checkInReservation', {
      type: 'Reservation',
      args: {
        id: nonNull(intArg()),
        checkedInPersons: nonNull(intArg()),
      },
      authorize: authorization('user'),
      resolve: async (_, {id, checkedInPersons}, {prismaClient}) => {
        const reservation = await prismaClient.reservation.findUnique({
          where: {id},
        });

        return prismaClient.reservation.update({
          data: {
            status: 'CheckedIn',
            checkedInPersons,
            checkInTime: reservation?.checkInTime ?? new Date(),
          },
          where: {
            id,
          },
        });
      },
    });
  },
});
