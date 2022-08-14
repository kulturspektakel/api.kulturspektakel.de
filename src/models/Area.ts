import {endOfDay} from 'date-fns';
import startOfDay from 'date-fns/startOfDay';
import {builder} from '../pothos/builder';

builder.prismaNode('Area', {
  id: {field: 'id'},
  fields: (t) => ({
    displayName: t.exposeString('displayName'),
    themeColor: t.exposeString('themeColor'),
    openingHour: t.relation('areaOpeningHour', {
      args: {
        day: t.arg({
          type: 'Date',
        }),
      },
      query: ({day}) => ({
        where: {
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
    }),
  }),
});
