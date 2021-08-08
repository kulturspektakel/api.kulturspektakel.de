import {endOfDay, startOfDay} from 'date-fns';
import {objectType} from 'nexus';
import authorization from '../utils/authorization';
import Node from './Node';
import {Table} from 'nexus-prisma';

export default objectType({
  name: 'Table',
  definition(t) {
    t.implements(Node);
    t.field(Table.id);
    t.field(Table.displayName);
    t.field(Table.maxCapacity);
    t.field(Table.type);
    t.field(Table.area);
    t.nonNull.list.nonNull.field('reservations', {
      type: 'Reservation',
      args: {
        day: 'Date',
      },
      authorize: authorization('user'),
      resolve: async (table, {day}, {prisma}) =>
        prisma.reservation.findMany({
          where: {
            tableId: table.id,
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
