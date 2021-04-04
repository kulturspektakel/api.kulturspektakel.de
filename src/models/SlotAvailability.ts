import {objectType} from 'nexus';

export default objectType({
  name: 'SlotAvailability',
  definition(t) {
    t.nonNull.field('available', {
      type: 'Boolean',
    });

    t.field('availabilityForSmallerPartySize', {
      type: 'Int',
    });

    t.field('availabilityForLargerPartySize', {
      type: 'Int',
    });

    t.nonNull.field('reservationSlot', {
      type: 'ReservationSlot',
    });

    t.list.field('consecutiveAvailableSlots', {
      type: 'ReservationSlot',
    });
  },
});

export const MAX_CONSECUTIVE_SLOTS = 2;
