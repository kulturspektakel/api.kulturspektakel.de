import {
  HeardAboutBookingFrom as HeardAboutBookingFromValues,
  PreviouslyPlayed as PreviouslyPlayedValues,
} from '@prisma/client';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import './BandApplicationRating';

const HeardAboutBookingFrom = builder.enumType('HeardAboutBookingFrom', {
  values: Object.values(HeardAboutBookingFromValues),
});

const PreviouslyPlayed = builder.enumType('PreviouslyPlayed', {
  values: Object.values(PreviouslyPlayedValues),
});

builder.prismaNode('BandApplication', {
  id: {field: 'id'},
  fields: (t) => ({
    bandname: t.exposeString('bandname'),
    genre: t.exposeString('genre', {nullable: true}),
    genreCategory: t.exposeString('genreCategory'),
    facebook: t.exposeString('facebook', {nullable: true}),
    facebookLikes: t.exposeInt('facebookLikes', {nullable: true}),
    description: t.exposeString('description', {nullable: true}),
    contactName: t.exposeString('contactName'),
    contactPhone: t.exposeString('contactPhone'),
    email: t.exposeString('email'),
    city: t.exposeString('city'),
    demo: t.exposeString('demo', {nullable: true}),
    instagram: t.exposeString('instagram', {nullable: true}),
    instagramFollower: t.exposeInt('instagramFollower', {nullable: true}),
    distance: t.exposeFloat('distance', {nullable: true}),
    heardAboutBookingFrom: t.expose('heardAboutBookingFrom', {
      nullable: true,
      type: HeardAboutBookingFrom,
    }),
    knowsKultFrom: t.exposeString('knowsKultFrom', {nullable: true}),
    numberOfArtists: t.exposeInt('numberOfArtists', {nullable: true}),
    numberOfNonMaleArtists: t.exposeInt('numberOfNonMaleArtists', {
      nullable: true,
    }),
    hasPreviouslyPlayed: t.expose('hasPreviouslyPlayed', {
      nullable: true,
      type: PreviouslyPlayed,
    }),
    website: t.exposeString('website', {nullable: true}),

    // TODO auth
    contactedByViewer: t.relation('contactedByViewer'),
    // TODO auth
    bandApplicationRating: t.relation('bandApplicationRating'),
    // TODO auth
    rating: t.field({
      nullable: true,
      type: 'Float',
      resolve: async (root, _, {token}) => {
        const ratings = await prismaClient.bandApplicationRating.findMany({
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
    }),
  }),
});
