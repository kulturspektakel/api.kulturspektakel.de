import {builder} from '../pothos/builder';
import {assetConnection, pixelImageField} from './Asset';

export default builder.prismaNode('Event', {
  id: {field: 'id'},
  fields: (t) => ({
    name: t.exposeString('name'),
    start: t.expose('start', {type: 'DateTime'}),
    end: t.expose('end', {type: 'DateTime'}),
    bandsPlaying: t.relatedConnection('BandPlaying', {
      cursor: 'id',
      edgesNullable: false,
      nullable: false,
      nodeNullable: false,
      query: () => ({
        orderBy: [
          {
            startTime: 'asc',
          },
          {
            area: {
              order: 'asc',
            },
          },
        ],
        where: {
          OR: [
            {
              announcementTime: {
                lte: new Date(),
              },
            },
            {
              announcementTime: null,
            },
          ],
        },
      }),
      totalCount: true,
    }),
    description: t.exposeString('description', {nullable: true}),
    bandApplicationStart: t.expose('bandApplicationStart', {
      type: 'DateTime',
      nullable: true,
    }),
    djApplicationStart: t.expose('djApplicationStart', {
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
    poster: pixelImageField(t as any, 'poster'),
    media: assetConnection(t as any, 'Event'),
    location: t.exposeString('location', {nullable: true}),
    latitude: t.exposeFloat('latitude', {nullable: true}),
    longitude: t.exposeFloat('longitude', {nullable: true}),
  }),
});
