import {Area, Reservation, ReservationSlot} from '@prisma/client';
import {endOfDay, startOfDay} from 'date-fns';
import {extendType} from 'nexus';
import {ArgsValue, intArg, nonNull} from 'nexus/dist/core';

export default extendType({
  type: 'Area',
  definition(t) {
    t.nonNull.list.nonNull.field('reservableSlots', {
      type: 'SlotAvailability',
      args: {
        date: nonNull('Date'),
      },
      resolve: async (
        area,
        {date, partySize}: ArgsValue<'Area', 'availableSlots'> & {date: Date},
        {prismaClient},
      ) => {
        return [];
      },
    });
  },
});
