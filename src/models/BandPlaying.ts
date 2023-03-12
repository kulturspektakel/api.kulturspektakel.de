import {encodeGlobalID} from '@pothos/plugin-relay';
import {builder} from '../pothos/builder';

export default builder.prismaNode('BandPlaying', {
  id: {field: 'id'},
  fields: (t) => ({
    name: t.exposeString('name'),
    genre: t.exposeString('genre', {nullable: true}),
    startTime: t.expose('startTime', {type: 'DateTime'}),
    endTime: t.expose('endTime', {type: 'DateTime'}),
    description: t.exposeString('description', {nullable: true}),
    eventId: t.field({
      type: 'ID',
      resolve: (t) => encodeGlobalID('Event', t.eventId),
    }),
    event: t.relation('event'),
    area: t.relation('area'),
  }),
});
