import {objectType} from 'nexus';
import {BandApplication} from 'nexus-prisma';
import authorization from '../utils/authorization';
import Node from './Node';

export default objectType({
  name: 'BandApplication',
  definition(t) {
    t.field(BandApplication.id);
    t.implements(Node);
    t.field(BandApplication.bandname);
    t.field(BandApplication.genre);
    t.field(BandApplication.genreCategory);
    t.field(BandApplication.facebook);
    t.field(BandApplication.facebookLikes);
    t.field(BandApplication.description);
    t.field(BandApplication.contactName);
    t.field(BandApplication.contactPhone);
    t.field(BandApplication.email);
    t.field(BandApplication.city);
    t.field(BandApplication.demo);
    t.field(BandApplication.instagram);
    t.field(BandApplication.instagramFollower);
    t.field(BandApplication.distance);
    t.field(BandApplication.heardAboutBookingFrom);
    t.field(BandApplication.knowsKultFrom);
    t.field(BandApplication.numberOfArtists);
    t.field(BandApplication.numberOfNonMaleArtists);
    t.field(BandApplication.hasPreviouslyPlayed);
    t.field(BandApplication.website);
    t.field({
      ...BandApplication.contactedByViewer,
      authorize: authorization('user'),
    });
    t.field({
      ...BandApplication.bandApplicationRating,
      authorize: authorization('user'),
    });
    t.field('rating', {
      type: 'Float',
      authorize: authorization('user'),
      resolve: async (root, _, {prisma, token}) => {
        const ratings = await prisma.bandApplicationRating.findMany({
          where: {
            bandApplicationId: root.id,
          },
        });
        const viewerId = token?.type === 'user' ? token.userId : undefined;
        if (ratings.length === 0) {
          return null;
        } else if (ratings.find((r) => r.viewerId === viewerId)) {
          return (
            ratings.reduce((acc, cv) => acc + cv.rating, 0) / ratings.length
          );
        } else {
          return null;
        }
      },
    });
  },
});
