import {builder} from '../pothos/builder';

export const config = Object.freeze({
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

const Board = builder.objectRef<typeof config['board']>('Board').implement({
  fields: (t) => ({
    chair: t.exposeString('chair'),
    deputy: t.exposeString('deputy'),
    deputy2: t.exposeString('deputy2'),
    treasurer: t.exposeString('treasurer'),
    secretary: t.exposeString('secretary'),
    observer: t.exposeString('observer'),
    observer2: t.exposeString('observer2'),
  }),
});

const Config = builder.objectRef<typeof config>('Config').implement({
  fields: (t) => ({
    depositValue: t.exposeInt('depositValue'),
    board: t.expose('board', {
      type: Board,
    }),
  }),
});

builder.queryField('config', (t) =>
  t.field({
    type: Config,
    resolve: () => config,
  }),
);
