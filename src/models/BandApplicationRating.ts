import {builder} from '../pothos/builder';

builder.prismaObject('BandApplicationRating', {
  fields: (t) => ({
    viewer: t.relation('viewer'),
    rating: t.exposeInt('rating'),
  }),
});
