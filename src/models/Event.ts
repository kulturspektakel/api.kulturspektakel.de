import {builder} from '../pothos/builder';
import Asset from './Asset';

export default builder.prismaNode('Event', {
  id: {field: 'id'},
  fields: (t) => ({
    name: t.exposeString('name'),
    start: t.expose('start', {type: 'DateTime'}),
    end: t.expose('end', {type: 'DateTime'}),
    bandsPlaying: t.relation('BandPlaying'),
    description: t.exposeString('description', {nullable: true}),
    bandApplicationStart: t.expose('bandApplicationStart', {
      type: 'DateTime',
      nullable: true,
    }),
    bandApplicationEnd: t.expose('bandApplicationEnd', {
      type: 'DateTime',
      nullable: true,
    }),
    djApplicationEnd: t.expose('djApplicationEnd', {
      type: 'DateTime',
      nullable: true,
    }),
    bandApplication: t.relation('bandApplication', {
      authScopes: {
        user: true,
      },
      query: () => ({
        orderBy: {
          createdAt: 'asc',
        },
      }),
    }),
    poster: t.field({
      type: Asset,
      nullable: true,
      resolve: () => {
        return {
          uri: `https://cms.kulturspektakel.de/assets/id`,
        };
      },
    }),
  }),
});
