import {enumType, extendType, inputObjectType, nonNull} from 'nexus';
import {
  GenreCategory as GenreCategoryT,
  HeardAboutBookingFrom,
} from 'nexus-prisma';
import confirmBandApplication from '../maizzle/mails/confirmBandApplication';
import {scheduleTask} from '../tasks';
import sendMail from '../utils/sendMail';
import {sendMessage, SlackChannel} from '../utils/slack';
import {getDistanceToKult} from '../queries/distanceToKult';
import {UserInputError} from 'apollo-server-express';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createBandApplication', {
      type: 'BandApplication',
      args: {
        data: nonNull(
          inputObjectType({
            name: 'CreateBandApplicationInput',
            definition(t) {
              t.field('email', {type: nonNull('String')});
              t.field('bandname', {type: nonNull('String')});
              t.field('genreCategory', {
                type: nonNull(enumType(GenreCategoryT)),
              });
              t.field('genre', {type: 'String'});
              t.field('city', {type: nonNull('String')});
              t.field('facebook', {type: 'String'});
              t.field('instagram', {type: 'String'});
              t.field('website', {type: 'String'});
              t.field('demo', {type: nonNull('String')});
              t.field('description', {type: nonNull('String')});
              t.field('numberOfArtists', {type: nonNull('Int')});
              t.field('numberOfNonMaleArtists', {type: nonNull('Int')});
              t.field('contactName', {type: nonNull('String')});
              t.field('contactPhone', {type: nonNull('String')});
              t.field('knowsKultFrom', {type: 'String'});
              t.field('heardAboutBookingFrom', {
                type: enumType(HeardAboutBookingFrom),
              });
            },
          }),
        ),
      },
      resolve: async (_, {data}, {prisma}) => {
        let distance = await getDistanceToKult(data.city);
        const now = new Date();
        const event = await prisma.event.findFirst({
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
        const application = await prisma.bandApplication.create({
          data: {
            ...data,
            distance,
            eventId: event.id,
          },
        });

        if (data.facebook) {
          await scheduleTask('facebookLikes', {id: application.id});
        }
        if (data.instagram) {
          await scheduleTask('instagramFollower', {id: application.id});
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
          channel: SlackChannel.dev,
          text: `Bewerbung von „${data.bandname}“`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*<' + data.demo + '|' + data.bandname + '>*',
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
    });
  },
});
