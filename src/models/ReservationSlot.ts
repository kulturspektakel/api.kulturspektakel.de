import {objectType} from 'nexus';

export default objectType({
  name: 'ReservationSlot',
  definition(t) {
    t.model.id();
    t.model.startTime();
    t.model.endTime();
    t.model.area();
    // t.model.reservation({
    //   // TODO authorize:
    // });
  },
});
