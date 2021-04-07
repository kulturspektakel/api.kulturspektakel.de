import {objectType} from 'nexus';

export default objectType({
  name: 'Reservation',
  definition(t) {
    t.model.id();
    t.model.status();
    t.model.token();
    t.model.reservationSlots({
      type: 'ReservationSlot',
    });
  },
});
