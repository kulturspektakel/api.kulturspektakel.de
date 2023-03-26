import {encodeGlobalID} from '@pothos/plugin-relay';
import {builder} from '../pothos/builder';
import {pixelImageField} from './Asset';

export default builder.prismaNode('BandPlaying', {
  id: {field: 'id'},
  fields: (t) => ({
    name: t.exposeString('name'),
    slug: t.exposeString('slug'),
    genre: t.exposeString('genre', {nullable: true}),
    startTime: t.expose('startTime', {type: 'DateTime'}),
    endTime: t.expose('endTime', {type: 'DateTime'}),
    description: t.exposeString('description', {nullable: true}),
    shortDescription: t.exposeString('shortDescription', {nullable: true}),
    eventId: t.field({
      type: 'ID',
      resolve: (t) => encodeGlobalID('Event', t.eventId),
    }),
    event: t.relation('event'),
    area: t.relation('area'),
    photo: pixelImageField(t as any, 'photo'),
  }),
});
