import {builder} from '../pothos/builder';
import {getImageSizes, ImageSize} from './ImageSize';

builder.prismaNode('Page', {
  id: {field: 'slug'},
  fields: (t) => ({
    bottom: t.exposeString('bottom', {nullable: true}),
    content: t.exposeString('content', {nullable: true}),
    left: t.exposeString('left', {nullable: true}),
    right: t.exposeString('right', {nullable: true}),
    title: t.exposeString('title'),
    imageSizes: t.field({
      type: [ImageSize],
      resolve: ({content, left, right, bottom}) =>
        getImageSizes([content, left, right, bottom].join('\n')),
    }),
  }),
});
