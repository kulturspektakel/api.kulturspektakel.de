import {objectType} from 'nexus';
import Node from './Node';

export default objectType({
  name: 'ReservationSlot',
  definition(t) {
    t.implements(Node);
    t.model.startTime();
    t.model.endTime();
    t.model.area();
    t.field('slotAvailability', {
      type: 'SlotAvailability',
    });
  },
});
