import {builder} from '../pothos/builder';

export default builder.prismaObject('BandApplicationComment', {
  fields: (t) => ({
    id: t.exposeID('id'),
    user: t.relation('viewer'),
    comment: t.exposeString('comment'),
    createdAt: t.expose('createdAt', {type: 'DateTime'}),
  }),
});
