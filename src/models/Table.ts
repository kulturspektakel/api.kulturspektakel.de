import {endOfDay, startOfDay} from 'date-fns';
import {objectType} from 'nexus';
import requireUserAuthorization from '../utils/requireUserAuthorization';

export default objectType({
  name: 'Table',
  definition(t) {
    t.model.id();
    t.model.displayName();
    t.model.maxCapacity();
    t.model.type();
    t.model.area({
      type: 'Area',
    });
    t.nonNull.list.nonNull.field('reservations', {
      type: 'Reservation',
      args: {
        day: 'Date',
      },
      ...requireUserAuthorization,
      resolve: async (table, {day}, {prismaClient}) =>
        prismaClient.reservation.findMany({
          where: {
            tableId: table.id,
            startTime: day
              ? {
                  gte: startOfDay(day),
                  lte: endOfDay(day),
                }
              : undefined,
            status: {
              not: 'Cleared',
            },
          },
          orderBy: {
            startTime: 'asc',
          },
        }),
    });
  },
});
