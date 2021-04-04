import {enumType} from 'nexus';
import {ReservationStatus} from '@prisma/client';

export default enumType({
  name: 'ReservationStatus',
  members: Object.values(ReservationStatus),
});
