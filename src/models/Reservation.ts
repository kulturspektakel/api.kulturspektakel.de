import {objectType} from 'nexus';
import requireUserAuthorization from '../utils/requireUserAuthorization';

export default objectType({
  name: 'Reservation',
  definition(t) {
    t.model.id();
    t.model.status();
    t.model.token();
    t.model.table();
    t.model.startTime();
    t.model.endTime();
    t.model.primaryPerson();
    t.model.otherPersons();
    t.model.checkedInPersons({
      ...requireUserAuthorization,
    });
  },
});
