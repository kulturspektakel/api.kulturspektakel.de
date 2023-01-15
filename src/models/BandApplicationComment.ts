import {builder} from '../pothos/builder';

export default builder.prismaNode('BandApplicationComment', {
  id: {field: 'id'},
  fields: (t) => ({
    user: t.relation('viewer'),
    comment: t.exposeString('comment'),
    createdAt: t.expose('createdAt', {type: 'DateTime'}),
  }),
});
