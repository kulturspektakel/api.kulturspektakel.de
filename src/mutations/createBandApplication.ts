import confirmBandApplication from '../maizzle/mails/confirmBandApplication';
import {scheduleTask} from '../tasks';
import sendMail from '../utils/sendMail';
import {SlackChannel} from '../utils/slack';
import normalizeUrl from 'normalize-url';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import BandApplication, {
  GenreCategory,
  HeardAboutBookingFrom,
} from '../models/BandApplication';
import PreviouslyPlayed from '../models/PreviouslyPlayed';
import {ApolloServerErrorCode} from '@apollo/server/errors';
import {GraphQLError} from 'graphql';

const CreateBandApplicationInput = builder.inputType(
  'CreateBandApplicationInput',
  {
    fields: (t) => ({
      email: t.field({type: 'String', required: true}),
      bandname: t.field({type: 'String', required: true}),
      genreCategory: t.field({type: GenreCategory, required: true}),
      genre: t.field({type: 'String'}),
      city: t.field({type: 'String', required: true}),
      facebook: t.field({type: 'String'}),
      instagram: t.field({type: 'String'}),
      website: t.field({type: 'String'}),
      demo: t.field({type: 'String'}),
      description: t.field({type: 'String', required: true}),
      numberOfArtists: t.field({type: 'Int'}),
      numberOfNonMaleArtists: t.field({type: 'Int'}),
      contactName: t.field({type: 'String', required: true}),
      contactPhone: t.field({type: 'String', required: true}),
      knowsKultFrom: t.field({type: 'String'}),
      heardAboutBookingFrom: t.field({type: HeardAboutBookingFrom}),
      hasPreviouslyPlayed: t.field({type: PreviouslyPlayed}),
    }),
  },
);

builder.mutationField('createBandApplication', (t) =>
  t.field({
    type: BandApplication,
    args: {
      eventId: t.arg.globalID({required: true}),
      data: t.arg({
        type: CreateBandApplicationInput,
        required: true,
      }),
    },
    resolve: async (
      _,
      {eventId, data: {demo, website, facebook, instagram, ...data}},
    ) => {
      const isDJ = data.genreCategory === 'DJ';
      if (!demo && !isDJ) {
        throw new GraphQLError('Demo material required', {
          extensions: {
            code: ApolloServerErrorCode.BAD_USER_INPUT,
          },
        });
      }

      if (demo?.indexOf(' ') === -1) {
        demo = normalizeUrl(demo);
      }
      website = website ? normalizeUrl(website) : null;
      facebook = facebook ? normalizeUrl(facebook) : null;

      const igUrl = instagram?.match(/instagram\.com\/([^\/?]+)/);
      if (igUrl && igUrl.length > 1) {
        instagram = igUrl[1];
      }
      // remove whitespaces, @ and trailing /
      instagram = instagram?.replace(/\s|@|\//g, '');

      const application = await prismaClient.bandApplication.create({
        data: {
          ...data,
          eventId: eventId.id,
          website,
          demo,
          facebook,
          instagram,
        },
        include: {
          event: true,
        },
      });

      const eventYear = application.event.start.getFullYear();
      await sendMail({
        from: isDJ
          ? 'Kulturspektakel Gauting info@kulturspektakel.de'
          : 'Kulturspektakel Gauting Booking booking@kulturspektakel.de',
        to: data.email,
        subject: `Bewerbung „${data.bandname}“ beim Kulturspektakel ${eventYear}`,
        html: confirmBandApplication({
          bandname: data.bandname,
          eventYear: String(eventYear),
        }),
      });

      const jobs = [
        scheduleTask('bandApplicationDistance', {id: application.id}),
        scheduleTask('slackMessage', {
          channel: isDJ ? SlackChannel.dj : SlackChannel.bandbewerbungen,
          text: `Bewerbung von „${data.bandname}“`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: demo
                  ? '*<' + demo + '|' + data.bandname + '>*'
                  : `*${data.bandname}*`,
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
                  text: `*Ort:*\n${data.city}`,
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
        }),
      ];
      if (demo) {
        jobs.push(
          scheduleTask('bandApplicationDemo', {
            id: application.id,
          }),
        );
      }
      if (facebook) {
        jobs.push(scheduleTask('facebookLikes', {id: application.id}));
      }
      if (instagram) {
        jobs.push(scheduleTask('instagramFollower', {id: application.id}));
      }

      await Promise.allSettled(jobs).then((res) =>
        res.forEach((r) =>
          r.status === 'rejected' ? console.error(r.reason) : null,
        ),
      );

      return application;
    },
  }),
);
