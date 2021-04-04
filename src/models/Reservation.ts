import {objectType} from 'nexus';

export default objectType({
  name: 'Reservation',
  definition(t) {
    t.model.id();
    t.model.status();
    t.model.reservationSlots({
      type: 'ReservationSlot',
    });
  },
});
