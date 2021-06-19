import {UserInputError} from 'apollo-server-express';
import {extendType, nonNull, intArg} from 'nexus';
import requireUserAuthorization from '../utils/requireUserAuthorization';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('checkInReservation', {
      type: 'Reservation',
      args: {
        id: nonNull(intArg()),
        checkedInPersons: nonNull(intArg()),
      },
      ...requireUserAuthorization,
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
