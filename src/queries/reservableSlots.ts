import {Area, Reservation, ReservationSlot} from '@prisma/client';
import {endOfDay, startOfDay} from 'date-fns';
import {extendType} from 'nexus';
import {ArgsValue, intArg, nonNull} from 'nexus/dist/core';

export default extendType({
  type: 'Area',
  definition(t) {
    t.list.field('reservableSlots', {
      type: 'SlotAvailability',
      args: {
        partySize: nonNull(intArg()),
        date: nonNull('Date'),
      },
      resolve: async (
        area,
        {date, partySize}: ArgsValue<'Area', 'availableSlots'> & {date: Date},
        {prismaClient},
      ) => {
        const slots = await prismaClient.reservationSlot.findMany({
          where: {
            AND: [
              {
                startTime: {
                  gte: startOfDay(date),
                },
              },
              {
                startTime: {
                  lte: endOfDay(date),
                },
              },
            ],
            areaId: area.id,
          },
          orderBy: {
            startTime: 'asc',
          },
          include: {
            reservations: {
              include: {
                table: true,
              },
            },
          },
        });

        const freeSeats = (
          reservationSlot: ReservationSlot & {
            reservations: Reservation[];
          },
        ): number =>
          (area as Area).maxCapacity -
          reservationSlot.reservations.reduce(
            (acc, cv) => acc + cv.otherPersons.length + 1,
            0,
          );

        const tables = await prismaClient.table.findMany({
          where: {
            areaId: area.id,
          },
          include: {
            reservations: true,
          },
        });

        return Promise.all(
          slots.map(async (reservationSlot, i) => {
            const reservedTables = new Set(
              reservationSlot.reservations.map((r) => r.tableId),
            );

            let available = false;
            let availabilityForLargerPartySize = null;
            let availabilityForSmallerPartySize = null;
            let consecutiveSlots = 0;

            for (let table of tables) {
              if (reservedTables.has(table.id)) {
                // table already booked
                continue;
              }
              if (partySize > table.maxCapacity) {
                availabilityForSmallerPartySize = Math.max(
                  availabilityForSmallerPartySize ?? -Infinity,
                  table.maxCapacity,
                );
              } else if (partySize < table.minOccupancy) {
                availabilityForLargerPartySize = Math.min(
                  availabilityForLargerPartySize ?? Infinity,
                  table.minOccupancy,
                );
              } else {
                available = true;

                for (let j = i + 1; j < slots.length; j++) {
                  const isReserved = slots[j].reservations.some(
                    (r) => r.tableId === table.id,
                  );
                  if (isReserved || freeSeats(slots[j]) < partySize) {
                    break;
                  }
                  consecutiveSlots = Math.max(consecutiveSlots, j - i);
                }
              }
            }

            const fs = freeSeats(reservationSlot);
            if (fs < partySize) {
              available = false;
              if (fs > 0) {
                availabilityForSmallerPartySize = fs;
              } else {
                availabilityForSmallerPartySize = null;
              }
              availabilityForLargerPartySize = null;
            }

            if (available) {
              availabilityForLargerPartySize = null;
              availabilityForSmallerPartySize = null;
            }

            return {
              available,
              consecutiveAvailableSlots: slots.slice(
                i + 1,
                i + 1 + consecutiveSlots,
              ),
              availabilityForLargerPartySize,
              availabilityForSmallerPartySize,
              reservationSlot,
            };
          }),
        );
      },
    });
  },
});
