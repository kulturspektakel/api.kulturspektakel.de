import {builder} from '../pothos/builder';

export default builder
  .objectRef<{
    id: string;
    uri: string;
    copyright?: string;
    title?: string;
    width?: number;
    height?: number;
  }>('Asset')
  .implement({
    fields: (t) => ({
      id: t.exposeString('id'),
      copyright: t.exposeString('copyright', {nullable: true}),
      uri: t.exposeString('uri'),
      title: t.exposeString('title', {nullable: true}),
      width: t.exposeInt('width', {nullable: true}),
      height: t.exposeInt('height', {nullable: true}),
    }),
  });
