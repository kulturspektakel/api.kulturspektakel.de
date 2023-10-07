import {builder} from '../pothos/builder';

builder.prismaNode('Page', {
  id: {field: 'slug'},
  fields: (t) => ({
    bottom: t.exposeString('bottom'),
    content: t.exposeString('content'),
    left: t.exposeString('left'),
    right: t.exposeString('right'),
    title: t.exposeString('title'),
  }),
});
