import {Area, prisma} from '@prisma/client';
import {endOfDay} from 'date-fns';
import startOfDay from 'date-fns/startOfDay';
import {objectType} from 'nexus';
import authorization from '../utils/authorization';
import Node from './Node';

export default objectType({
  name: 'Area',
  definition(t) {
    t.implements(Node);
    t.model.displayName();
    t.model.themeColor();
    t.nonNull.list.nonNull.field('table', {
      type: 'Table',
      authorize: authorization('user'),
      resolve: (area, _, {prismaClient}) =>
        prismaClient.table.findMany({
          where: {
            areaId: (area as Area).id,
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
      resolve: (area, {day}, {prismaClient}) => {
        return prismaClient.areaOpeningHour.findMany({
          where: {
            areaId: (area as Area).id,
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
        });
      },
    });

    t.nonNull.field('availableTables', {
      type: 'Int',
      args: {
        time: 'DateTime',
      },
      resolve: async (area, args, {prismaClient}) => {
        const time = new Date() ?? args;
        const table = await prismaClient.table.findMany({
          where: {
            area: {
              id: (area as Area).id,
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
