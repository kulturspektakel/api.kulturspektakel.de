import {Reservation} from '@prisma/client';
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
    t.model.note({
      ...requireUserAuthorization,
    });

    t.nonNull.list.field('alternativeTables', {
      type: 'Table',
      ...requireUserAuthorization,
      resolve: async (reservation, _args, {prismaClient}) => {
        return prismaClient.table.findMany({
          where: {
            maxCapacity: {
              gte: Math.max(
                reservation.checkedInPersons,
                reservation.otherPersons.length + 1,
              ),
            },
            id: {
              not: (reservation as Reservation).tableId,
            },
            reservations: {
              // TODO
              none: {
                startTime: {},
                endTime: {},
              },
            },
          },
        });
      },
    });
  },
});
