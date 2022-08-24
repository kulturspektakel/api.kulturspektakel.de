import {endOfDay} from 'date-fns';
import startOfDay from 'date-fns/startOfDay';
import {builder} from '../pothos/builder';
import OpeningHour from './OpeningHour';

export default builder.prismaNode('Area', {
  id: {field: 'id'},
  fields: (t) => ({
    displayName: t.exposeString('displayName'),
    themeColor: t.exposeString('themeColor'),
    bandsPlaying: t.relation('BandPlaying', {
      args: {
        day: t.arg({type: 'Date', required: true}),
      },
      query: ({day}) => ({
        where: {
          startTime: {
            gte: startOfDay(day),
            lte: endOfDay(day),
          },
        },
      }),
    }),
    openingHour: t.relation('areaOpeningHour', {
      type: OpeningHour,
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
