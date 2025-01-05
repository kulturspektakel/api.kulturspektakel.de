import {builder} from '../pothos/builder';

export const config = Object.freeze({
  depositValue: 200,
  board: {
    chair: 'Max Schrake',
    deputy: 'Tristan Häuser',
    deputy2: 'Gabriel Knoll',
    treasurer: 'Valentin Langer',
    secretary: 'Anton Sanktjohnaser',
    observer: 'Adrian Luck',
    observer2: 'Kristian Aumayer',
  },
  membershipFees: {
    kult: {
      reduced: 1500,
      regular: 3000,
    },
    foerderverein: {
      reduced: 1500,
      regular: 3000,
    },
  },
});

const Board = builder.objectRef<(typeof config)['board']>('Board').implement({
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

export enum MembershipT {
  kult = 'Kulturspektakel Gauting e.V.',
  foerderverein = 'Förderverein Kulturspektakel Gauting e.V.',
}

export enum MembershipTypeT {
  reduced = 'reduced',
  regular = 'regular',
  supporter = 'supporter',
}

const MembershipFee = builder
  .objectRef<
    (typeof config)['membershipFees'][keyof (typeof config)['membershipFees']]
  >('MembershipFee')
  .implement({
    fields: (t) => ({
      reduced: t.exposeInt('reduced'),
      regular: t.exposeInt('regular'),
    }),
  });

const MembershipFees = builder
  .objectRef<(typeof config)['membershipFees']>('MembershipFees')
  .implement({
    fields: (t) => ({
      kult: t.expose('kult', {type: MembershipFee}),
      foerderverein: t.expose('foerderverein', {type: MembershipFee}),
    }),
  });

const Config = builder.objectRef<typeof config>('Config').implement({
  fields: (t) => ({
    depositValue: t.exposeInt('depositValue'),
    board: t.expose('board', {
      type: Board,
    }),
    membershipFees: t.expose('membershipFees', {
      type: MembershipFees,
    }),
  }),
});

builder.queryField('config', (t) =>
  t.field({
    type: Config,
    resolve: () => config,
  }),
);
