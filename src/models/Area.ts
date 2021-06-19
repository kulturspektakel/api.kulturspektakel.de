import {Area} from '@prisma/client';
import {endOfDay} from 'date-fns';
import startOfDay from 'date-fns/startOfDay';
import {objectType} from 'nexus';
import requireUserAuthorization from '../utils/requireUserAuthorization';
import Node from './Node';

export default objectType({
  name: 'Area',
  definition(t) {
    t.implements(Node);
    t.model.displayName();
    t.model.themeColor();
    t.model.table({
      ...requireUserAuthorization,
    });

    t.nonNull.list.nonNull.field('openingHour', {
      type: 'OpeningHour',
      args: {
        day: 'Date',
      },
      resolve: (area, args, {prismaClient}) => {
        const day = args.day ?? new Date();
        return prismaClient.areaOpeningHour.findMany({
          where: {
            areaId: (area as Area).id,
            startTime: {
              gte: startOfDay(day),
              lte: endOfDay(day),
            },
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
                status: {
                  not: 'Cleared',
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
