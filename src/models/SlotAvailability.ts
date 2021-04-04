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
  },
});

export const MAX_CONSECUTIVE_SLOTS = 2;
