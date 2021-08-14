import {extendType, nonNull, objectType} from 'nexus';

export const config = Object.freeze({
  reservationStart: new Date('2021-07-03T13:00:00.000Z'),
  capacityLimit: 1500,
  tokenValue: 200,
  bandApplicationDeadline: new Date('2022-02-25T23:00:00.000Z'),
});

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('config', {
      type: objectType({
        name: 'Config',
        definition: (t) => {
          t.field('reservationStart', {
            type: nonNull('DateTime'),
          });
          t.field('tokenValue', {
            type: nonNull('Int'),
          });
          t.field('bandApplicationDeadline', {
            type: nonNull('DateTime'),
          });
        },
      }),
      resolve: () => config,
    });
  },
});
