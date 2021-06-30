import {extendType, objectType} from 'nexus';

export const config = Object.freeze({
  reservationStart: new Date('2021-07-03T13:00:00.000Z'),
  capacityLimit: 1500,
});

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('config', {
      type: objectType({
        name: 'Config',
        definition: (t) => {
          t.field('reservationStart', {
            type: 'DateTime',
          });
        },
      }),
      resolve: () => config,
    });
  },
});
