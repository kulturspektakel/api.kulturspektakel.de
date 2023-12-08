import {builder} from '../pothos/builder';
import {ImageSize, getImageSizes} from './ImageSize';

export default builder.prismaNode('News', {
  id: {field: 'slug'},
  fields: (t) => ({
    title: t.exposeString('title'),
    slug: t.exposeString('slug'),
    content: t.exposeString('content'),
    createdAt: t.expose('createdAt', {type: 'Date'}),
    imageSizes: t.field({
      type: [ImageSize],
      resolve: ({content}) => getImageSizes(content),
    }),
  }),
});
