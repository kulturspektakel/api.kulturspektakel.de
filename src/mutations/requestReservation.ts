import {extendType, stringArg, nonNull, list, idArg} from 'nexus';
import sendMail from '../utils/sendMail';
import endOfDay from 'date-fns/endOfDay';
import {UserInputError} from 'apollo-server-errors';
import {PrismaClient, ReservationSlot} from '.prisma/client';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('requestReservation', {
      type: 'Reservation',
      args: {
        primaryEmail: nonNull(stringArg()),
        primaryPerson: nonNull(stringArg()),
        otherEmails: nonNull(list(nonNull(stringArg()))),
        otherPersons: nonNull(list(nonNull(stringArg()))),
        slotIds: nonNull(list(nonNull(idArg()))),
      },
      resolve: async (
        _,
        {primaryEmail, primaryPerson, otherEmails, otherPersons, slotIds},
        {prismaClient},
      ) => {
        // TODO validate primary and others
        const partySize = otherPersons.length + 1;

        const slots = await prismaClient.reservationSlot.findMany({
          where: {
            id: {
              in: slotIds,
            },
          },
          orderBy: {
            startTime: 'asc',
          },
          include: {
            reservations: {
              include: {
                reservationSlots: true,
              },
            },
            area: true,
          },
        });

        if (slots.length === 0) {
          return null;
        }

        const areaId = slots[0].areaId;

        if (!slots.every((s) => s.areaId === areaId)) {
          throw new UserInputError('Slots not in same area');
        }

        if (!(await slotsAreConsecutive(prismaClient, slots))) {
          throw new UserInputError('Slots can not be reserved together');
        }

        if (
          !slots.every(
            (slot) =>
              slot.reservations.reduce(
                (acc, r) => acc + r.otherPersons.length + 1,
                0,
              ) +
                partySize <=
              slot.area.maxCapacity,
          )
        ) {
          // not enough area capacity
          return null;
        }

        const tables = await prismaClient.table.findMany({
          where: {
            minOccupancy: {
              lte: partySize,
            },
            maxCapacity: {
              gte: partySize,
            },
            areaId,
          },
          include: {
            reservations: true,
          },
          orderBy: {
            maxCapacity: 'asc',
          },
        });

        let tableId: string | null = null;
        for (let table of tables) {
          const hasReservations = slots.some((slot) =>
            slot.reservations.some((r) => r.tableId === table.id),
          );

          if (!hasReservations) {
            tableId = table.id;
            break;
          }
        }

        if (tableId == null) {
          return null;
        }

        const reservation = await prismaClient.reservation.create({
          data: {
            primaryEmail,
            primaryPerson,
            otherEmails,
            otherPersons,
            reservationSlots: {
              connect: slotIds.map((id) => ({id})),
            },
            table: {
              connect: {
                id: tableId,
              },
            },
          },
        });

        try {
          await sendMail({
            from: 'dani@kulturspektakel.de',
            to: primaryEmail,
            text: 'test body',
            subject: 'Kulturspektakel Reservierung',
          });
        } catch (e) {
          // clear reservation, because it can't be confirmed
          await prismaClient.reservation.delete({
            where: {
              id: reservation.id,
            },
          });
          return null;
        }

        return reservation;
      },
    });
  },
});

async function slotsAreConsecutive(
  prismaClient: PrismaClient,
  slots: ReservationSlot[],
): Promise<boolean> {
  if (slots.length < 2) {
    return true;
  }
  const consecutiveSlots = await prismaClient.reservationSlot.findMany({
    where: {
      areaId: slots[0].areaId,
      AND: [
        {
          startTime: {
            gte: slots[0].startTime,
          },
        },
        {
          startTime: {
            lte: endOfDay(slots[0].startTime),
          },
        },
      ],
    },
  });

  for (let i = 0; i < slots.length; i++) {
    if (slots[i].id !== consecutiveSlots[i]?.id) {
      return false;
    }
  }
  return true;
}
