import {Area} from '@prisma/client';
import {endOfDay} from 'date-fns';
import startOfDay from 'date-fns/startOfDay';
import {objectType} from 'nexus';
import requireAuthorization from '../utils/requireUserAuthorization';
import Node from './Node';

export default objectType({
  name: 'Area',
  definition(t) {
    t.implements(Node);
    t.model.displayName();
    t.model.table({
      ...requireAuthorization,
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
  },
});
