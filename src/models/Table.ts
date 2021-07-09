import {Table} from '@prisma/client';
import {endOfDay, startOfDay} from 'date-fns';
import {objectType} from 'nexus';
import authorization from '../utils/authorization';
import Node from './Node';

export default objectType({
  name: 'Table',
  definition(t) {
    t.implements(Node);
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
      authorize: authorization('user'),
      resolve: async (table, {day}, {prismaClient}) =>
        prismaClient.reservation.findMany({
          where: {
            tableId: (table as Table).id,
            startTime: day
              ? {
                  gte: startOfDay(day),
                  lte: endOfDay(day),
                }
              : undefined,
          },
          orderBy: {
            startTime: 'asc',
          },
        }),
    });
  },
});
