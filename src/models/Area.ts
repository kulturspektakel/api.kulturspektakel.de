import {Area} from 'nexus-prisma';
import {endOfDay} from 'date-fns';
import startOfDay from 'date-fns/startOfDay';
import {objectType} from 'nexus';
import authorization from '../utils/authorization';
import Node from './Node';

export default objectType({
  name: 'Area',
  definition(t) {
    t.implements(Node);
    t.field(Area.id);
    t.field(Area.displayName);
    t.field(Area.themeColor);
    t.nonNull.list.nonNull.field('table', {
      type: 'Table',
      authorize: authorization('user'),
      resolve: (area, _, {prisma}) =>
        prisma.table.findMany({
          where: {
            areaId: area.id,
          },
          orderBy: {
            id: 'asc',
          },
        }),
    });

    t.nonNull.list.nonNull.field('openingHour', {
      type: 'OpeningHour',
      args: {
        day: 'Date',
      },
      resolve: (area, {day}, {prisma}) =>
        prisma.areaOpeningHour.findMany({
          where: {
            areaId: area.id,
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

    t.nonNull.field('availableTables', {
      type: 'Int',
      args: {
        time: 'DateTime',
      },
      resolve: async (area, args, {prisma}) => {
        const time = new Date() ?? args;
        const table = await prisma.table.findMany({
          where: {
            area: {
              id: area.id,
            },
          },
          include: {
            reservations: {
              where: {
                OR: [
                  {
                    checkInTime: {
                      lte: time,
                    },
                  },
                  {
                    startTime: {
                      lte: time,
                    },
                  },
                ],
                endTime: {
                  gte: time,
                },
              },
            },
          },
        });

        return table.reduce(
          (acc, cv) => acc + (cv.reservations.length > 0 ? 0 : 1),
          0,
        );
      },
    });
  },
});
