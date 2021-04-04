import {objectType} from 'nexus';
import requireAuthorization from '../utils/requireAuthorization';
import Node from './Node';

export default objectType({
  name: 'Area',
  definition(t) {
    t.implements(Node);
    t.model.displayName();
    t.model.reservationSlot({
      ordering: {
        startTime: true,
      },
    });
    t.model.table({
      ...requireAuthorization,
    });
  },
});
