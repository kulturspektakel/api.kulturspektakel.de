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
    t.model.table({
      ...requireUserAuthorization,
    });
    t.model.maxCapacity({
      ...requireUserAuthorization,
    });

    t.nonNull.list.nonNull.field('openingHour', {
      type: 'Availability',
      args: {
        day: 'Date',
      },
      resolve: (area, {day}, {prismaClient}) =>
        prismaClient.areaOpeningHour.findMany({
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
        }),
    });

    t.nonNull.field('currentCapacity', {
      type: 'Int',
      ...requireUserAuthorization,
      resolve: async (area, _args, {prismaClient}) => {
        const now = new Date();
        const {sum} = await prismaClient.reservation.aggregate({
          sum: {
            checkedInPersons: true,
          },
          where: {
            table: {
              areaId: (area as Area).id,
            },
            checkInTime: {
              lte: now,
            },
            endTime: {
              gte: now,
            },
            status: 'CheckedIn',
          },
        });

        return sum.checkedInPersons ?? 0;
      },
    });

    t.nonNull.field('availableCapacity', {
      type: 'Int',
      ...requireUserAuthorization,
      resolve: async (area, _args, {prismaClient}) => {
        const now = new Date();
        const reservations = await prismaClient.reservation.findMany({
          where: {
            table: {
              areaId: (area as Area).id,
            },
            OR: [
              {
                checkInTime: {
                  lte: now,
                },
              },
              {
                startTime: {
                  lte: now,
                },
              },
            ],
            endTime: {
              gte: now,
            },
            status: {
              in: ['Confirmed', 'CheckedIn'],
            },
          },
        });

        return (
          area.maxCapacity -
          reservations.reduce(
            (acc, cv) =>
              acc + Math.max(cv.checkedInPersons, cv.otherPersons.length + 1),
            0,
          )
        );
      },
    });
  },
});
