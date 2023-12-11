import {builder} from '../pothos/builder';
import {markdownField} from './MarkdownString';

builder.prismaNode('Page', {
  id: {field: 'slug'},
  fields: (t) => ({
    content: markdownField(t as any, 'content', {nullable: true}),
    left: markdownField(t as any, 'left', {nullable: true}),
    right: markdownField(t as any, 'right', {nullable: true}),
    bottom: markdownField(t as any, 'bottom', {nullable: true}),
    title: t.exposeString('title'),
  }),
});
