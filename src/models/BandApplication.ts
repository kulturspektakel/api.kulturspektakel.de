import {
  HeardAboutBookingFrom as HeardAboutBookingFromValues,
  GenreCategory as GenreCategoryValues,
  DemoEmbedType as DemoEmbedTypeValues,
  BandRepertoire as BandRepertoireValues,
} from '@prisma/client';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import './BandApplicationRating';
import PreviouslyPlayed from './PreviouslyPlayed';
import {isPast} from 'date-fns';
import viewerIdFromToken from '../utils/viewerIdFromToken';
import sanitizeTSQuery from '../utils/sanitizeTSQuery';

export const HeardAboutBookingFrom = builder.enumType('HeardAboutBookingFrom', {
  values: Object.values(HeardAboutBookingFromValues),
});

export const GenreCategory = builder.enumType('GenreCategory', {
  values: Object.values(GenreCategoryValues),
});

export const DemoEmbedType = builder.enumType('DemoEmbedType', {
  values: Object.values(DemoEmbedTypeValues),
});

export const BandRepertoireType = builder.enumType('BandRepertoireType', {
  values: Object.values(BandRepertoireValues),
});

export default builder.prismaNode('BandApplication', {
  id: {field: 'id'},
  fields: (t) => ({
    createdAt: t.expose('createdAt', {type: 'DateTime'}),
    bandname: t.exposeString('bandname'),
    genre: t.exposeString('genre', {nullable: true}),
    genreCategory: t.expose('genreCategory', {type: GenreCategory}),
    facebook: t.exposeString('facebook', {nullable: true}),
    facebookLikes: t.exposeInt('facebookLikes', {nullable: true}),
    description: t.exposeString('description', {nullable: true}),
    contactName: t.exposeString('contactName'),
    contactPhone: t.exposeString('contactPhone'),
    email: t.exposeString('email'),
    eventId: t.exposeID('eventId'),
    event: t.relation('event'),
    city: t.exposeString('city'),
    demo: t.exposeString('demo', {nullable: true}),
    demoEmbedUrl: t.exposeString('demoEmbedUrl', {nullable: true}),
    demoEmbed: t.exposeString('demoEmbed', {nullable: true}),
    demoEmbedType: t.expose('demoEmbedType', {
      type: DemoEmbedType,
      nullable: true,
    }),
    instagram: t.exposeString('instagram', {nullable: true}),
    instagramFollower: t.exposeInt('instagramFollower', {nullable: true}),
    distance: t.exposeFloat('distance', {nullable: true}),
    latitude: t.exposeFloat('latitude', {nullable: true}),
    longitude: t.exposeFloat('longitude', {nullable: true}),
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
    contactedByViewer: t.relation('contactedByViewer', {
      nullable: true,
      authScopes: {
        user: true,
      },
    }),
    bandApplicationRating: t.relation('bandApplicationRating', {
      authScopes: {
        user: true,
      },
    }),
    comments: t.relatedConnection(
      'bandApplicationComment',
      {
        cursor: 'id',
        totalCount: true,
        query: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      {
        authScopes: {
          user: true,
        },
        nodeNullable: false,
        edgesNullable: false,
      },
    ),
    rating: t.field({
      authScopes: {
        user: true,
      },
      nullable: true,
      type: 'Float',
      resolve: async (root, _, {parsedToken}) => {
        const [ratings, event] = await Promise.all([
          prismaClient.bandApplicationRating.findMany({
            where: {
              bandApplicationId: root.id,
            },
          }),
          prismaClient.event.findUniqueOrThrow({
            where: {
              id: root.eventId,
            },
          }),
        ]);

        const viewerId = await viewerIdFromToken(parsedToken);
        if (ratings.length === 0) {
          return null;
        } else if (
          isPast(event.end) ||
          ratings.find((r) => r.viewerId === viewerId)
        ) {
          return (
            ratings.reduce((acc, cv) => acc + cv.rating, 0) / ratings.length
          );
        } else {
          return null;
        }
      },
    }),
    pastApplications: t.prismaField({
      type: ['BandApplication'],
      resolve: (query, parent) =>
        prismaClient.bandApplication.findMany({
          ...query,
          where: {
            id: {not: parent.id},
            bandname: {
              search: sanitizeTSQuery(parent.bandname, {spacesOptional: true}),
            },
          },
          orderBy: {
            eventId: 'desc',
          },
        }),
    }),
    pastPerformances: t.prismaField({
      type: ['BandPlaying'],
      resolve: (query, parent) =>
        prismaClient.bandPlaying.findMany({
          ...query,
          where: {
            id: {not: parent.id},
            name: {
              search: sanitizeTSQuery(parent.bandname, {spacesOptional: true}),
            },
          },
          orderBy: {
            eventId: 'desc',
          },
        }),
    }),
  }),
});
