import {extendType, objectType} from 'nexus';

export const config = Object.freeze({
  reservationStart: new Date(),
  capacityLimit: 500,
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
