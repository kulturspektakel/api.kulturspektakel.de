import {objectType} from 'nexus';
import {BandApplicationRating} from 'nexus-prisma';

export default objectType({
  name: 'BandApplicationRating',
  definition(t) {
    t.field(BandApplicationRating.viewer);
    t.field(BandApplicationRating.rating);
  },
});
