import {builder} from '../pothos/builder';

export default builder
  .objectRef<{
    name: string;
    id: string;
    image: string | null;
    genre: string | null;
  }>('SpotifyArtist')
  .implement({
    fields: (t) => ({
      id: t.exposeString('id'),
      name: t.exposeString('name'),
      image: t.exposeString('image', {nullable: true}),
      genre: t.exposeString('genre', {nullable: true}),
    }),
  });
