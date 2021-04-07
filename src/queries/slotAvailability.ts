import {Reservation, ReservationSlot} from '@prisma/client';
import {extendType} from 'nexus';
import {ArgsValue, intArg, nonNull} from 'nexus/dist/core';

export default extendType({
  type: 'ReservationSlot',
  definition(t) {
    t.nonNull.field('slotAvailability', {
      type: 'SlotAvailability',
      args: {
        partySize: nonNull(intArg()),
      },
      resolve: async (
        parent,
        {partySize}: ArgsValue<'Area', 'availableSlots'> & {date: Date},
        {prismaClient},
      ) => {
        const slot = await prismaClient.reservationSlot.findUnique({
          where: {
            id: (parent as ReservationSlot).id,
          },
          include: {
            reservations: {
              include: {
                table: true,
              },
            },
            area: true,
          },
        });

        if (slot == null) {
          throw new Error('Could not find slot');
        }

        const freeSeats = (
          reservationSlot: ReservationSlot & {
            reservations: Reservation[];
          },
        ): number =>
          slot.area.maxCapacity -
          reservationSlot.reservations.reduce(
            (acc, cv) => acc + cv.otherPersons.length + 1,
            0,
          );

        const tables = await prismaClient.table.findMany({
          where: {
            areaId: slot.area.id,
          },
          include: {
            reservations: true,
          },
        });

        const reservedTables = new Set(slot.reservations.map((r) => r.tableId));

        let available = false;
        let availabilityForLargerPartySize = null;
        let availabilityForSmallerPartySize = null;

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
          }
        }

        // apply area limits
        const fs = freeSeats(slot);
        if (fs < partySize) {
          availabilityForLargerPartySize = null;
          availabilityForSmallerPartySize = Math.min(
            availabilityForSmallerPartySize ?? fs,
            fs,
          );
          available = false;
        }

        if (available) {
          availabilityForLargerPartySize = null;
          availabilityForSmallerPartySize = null;
        }

        return {
          available,
          availabilityForLargerPartySize,
          availabilityForSmallerPartySize,
        };
      },
    });
  },
});
