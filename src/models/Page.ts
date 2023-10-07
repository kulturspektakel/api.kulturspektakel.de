import {builder} from '../pothos/builder';

builder.prismaNode('Page', {
  id: {field: 'slug'},
  fields: (t) => ({
    bottom: t.exposeString('bottom', {nullable: true}),
    content: t.exposeString('content', {nullable: true}),
    left: t.exposeString('left', {nullable: true}),
    right: t.exposeString('right', {nullable: true}),
    title: t.exposeString('title'),
  }),
});
