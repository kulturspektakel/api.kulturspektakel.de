import {UserInputError} from 'apollo-server-express';
import {extendType, idArg, stringArg, nonNull, list} from 'nexus';
import authorization from '../utils/authorization';
import {sendConfirmationMail} from './confirmReservation';
import {
  checkOccupancy,
  whereHasNoOverlappingReservation,
} from './requestReservation';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createReservation', {
      type: 'Reservation',
      authorize: authorization('user'),
      args: {
        tableId: nonNull(idArg()),
        primaryEmail: nonNull(stringArg()),
        primaryPerson: nonNull(stringArg()),
        otherPersons: nonNull(list(nonNull(stringArg()))),
        startTime: nonNull('DateTime'),
        endTime: nonNull('DateTime'),
        note: stringArg(),
      },
      resolve: async (
        _,
        {
          primaryEmail,
          primaryPerson,
          otherPersons,
          startTime,
          endTime,
          note,
          tableId,
        },
        {prisma},
      ) => {
        const partySize = otherPersons.length + 1;
        await checkOccupancy(prisma, startTime, endTime, partySize);

        const table = await prisma.table.findFirst({
          where: {
            id: tableId,
            reservations: whereHasNoOverlappingReservation(startTime, endTime),
          },
        });

        if (!table) {
          throw new UserInputError('Tisch nicht verfügber');
        }

        const reservation = await prisma.reservation.create({
          data: {
            primaryEmail,
            primaryPerson,
            otherPersons,
            startTime,
            endTime,
            note,
            tableId,
            status: 'Confirmed',
          },
          include: {
            table: {
              include: {
                area: true,
              },
            },
          },
        });

        await sendConfirmationMail(prisma, reservation);

        return reservation;
      },
    });
  },
});
