import {builder} from '../pothos/builder';

export default builder.prismaNode('News', {
  id: {field: 'slug'},
  fields: (t) => ({
    title: t.exposeString('title'),
    slug: t.exposeString('slug'),
    content: t.exposeString('content'),
    createdAt: t.expose('createdAt', {type: 'Date'}),
  }),
});