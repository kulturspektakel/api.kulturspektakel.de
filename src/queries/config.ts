import {extendType, nonNull, objectType} from 'nexus';

export const config = Object.freeze({
  reservationStart: new Date('2021-07-03T13:00:00.000Z'),
  capacityLimit: 1500,
  depositValue: 200,
  board: {
    chair: 'Gabriel Knoll',
    deputy: 'Tristan Häuser',
    deputy2: 'Tristan Häuser',
    treasurer: 'Valentin Langer',
    secretary: 'Lara Bühler',
    observer: 'Adrian Luck',
    observer2: 'Laila Dörmer',
  },
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
          t.field('depositValue', {
            type: nonNull('Int'),
          });
          t.field('board', {
            type: objectType({
              name: 'Board',
              definition: (t) => {
                t.nonNull.field('chair', {type: 'String'});
                t.nonNull.field('deputy', {type: 'String'});
                t.nonNull.field('deputy2', {type: 'String'});
                t.nonNull.field('treasurer', {type: 'String'});
                t.nonNull.field('secretary', {type: 'String'});
                t.nonNull.field('observer', {type: 'String'});
                t.nonNull.field('observer2', {type: 'String'});
              },
            }),
          });
        },
      }),
      resolve: () => config,
    });
  },
});
