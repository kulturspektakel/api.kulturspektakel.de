import {builder} from '../pothos/builder';
import {markdownField} from './MarkdownString';

export default builder.prismaNode('News', {
  id: {field: 'slug'},
  nullable: true,
  fields: (t) => ({
    title: t.exposeString('title'),
    slug: t.exposeString('slug'),
    content: markdownField(t as any, 'content'),
    createdAt: t.expose('createdAt', {type: 'Date'}),
  }),
});
