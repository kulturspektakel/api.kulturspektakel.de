import confirmBandApplication from '../maizzle/mails/confirmBandApplication';
import {scheduleTask} from '../tasks';
import sendMail from '../utils/sendMail';
import {sendMessage, SlackChannel} from '../utils/slack';
import {getDistanceToKult} from '../queries/distanceToKult';
import {UserInputError} from 'apollo-server-express';
import normalizeUrl from 'normalize-url';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import BandApplication, {
  GenreCategory,
  HeardAboutBookingFrom,
} from '../models/BandApplication';
import PreviouslyPlayed from '../models/PreviouslyPlayed';

builder.mutationField('createBandApplication', (t) =>
  t.field({
    type: BandApplication,
    args: {
      email: t.arg({type: 'String', required: true}),
      bandname: t.arg({type: 'String', required: true}),
      genreCategory: t.arg({type: GenreCategory, required: true}),
      genre: t.arg({type: 'String'}),
      city: t.arg({type: 'String', required: true}),
      facebook: t.arg({type: 'String'}),
      instagram: t.arg({type: 'String'}),
      website: t.arg({type: 'String'}),
      demo: t.arg({type: 'String', required: true}),
      description: t.arg({type: 'String', required: true}),
      numberOfArtists: t.arg({type: 'Int', required: true}),
      numberOfNonMaleArtists: t.arg({type: 'Int', required: true}),
      contactName: t.arg({type: 'String', required: true}),
      contactPhone: t.arg({type: 'String', required: true}),
      knowsKultFrom: t.arg({type: 'String'}),
      heardAboutBookingFrom: t.arg({type: HeardAboutBookingFrom}),
      hasPreviouslyPlayed: t.arg({type: PreviouslyPlayed}),
    },
    resolve: async (_, {demo, website, facebook, instagram, ...data}) => {
      demo = normalizeUrl(demo);
      website = website ? normalizeUrl(website) : null;
      facebook = facebook ? normalizeUrl(facebook) : null;

      const igUrl = instagram?.match(/instagram\.com\/([^\/?]+)/);
      if (igUrl && igUrl.length > 1) {
        instagram = igUrl[1];
      }
      // remove whitespaces, @ and trailing /
      instagram = instagram?.replace(/\s|@|\//g, '');

      let distance = await getDistanceToKult(data.city);
      const now = new Date();
      const event = await prismaClient.event.findFirst({
        where: {
          bandApplicationStart: {
            lte: now,
          },
          bandApplicationEnd: {
            gte: now,
          },
        },
      });
      if (!event) {
        throw new UserInputError('No event found');
      }
      const eventYear = event.start.getFullYear();
      const application = await prismaClient.bandApplication.create({
        data: {
          ...data,
          distance,
          eventId: event.id,
          website,
          demo,
          facebook,
          instagram,
        },
      });

      try {
        if (facebook) {
          await scheduleTask('facebookLikes', {id: application.id});
        }
        if (instagram) {
          await scheduleTask('instagramFollower', {id: application.id});
        }
      } catch (e) {
        console.error(e);
      }

      await sendMail({
        from: 'Kulturspektakel Gauting Booking booking@kulturspektakel.de',
        to: data.email,
        subject: `Bewerbung „${data.bandname}“ beim Kulturspektakel ${eventYear}`,
        html: confirmBandApplication({
          bandname: data.bandname,
          eventYear: String(eventYear),
        }),
      });

      await sendMessage({
        channel: SlackChannel.bandbewerbungen,
        text: `Bewerbung von „${data.bandname}“`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*<' + demo + '|' + data.bandname + '>*',
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Genre:*\n${data.genre ?? data.genreCategory}`,
              },
              {
                type: 'mrkdwn',
                text: `*Ort:*\n${data.city}${
                  distance ? ` (${distance.toFixed()}km)` : ''
                }`,
              },
            ],
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `*AnsprechpartnerIn:* ${data.contactName} (${data.contactPhone}) ${data.email}`,
              },
            ],
          },
          {
            type: 'divider',
          },
        ],
      });

      return application;
    },
  }),
);
