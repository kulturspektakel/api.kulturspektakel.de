import {JobHelpers} from 'graphile-worker';
import {scheduleTask} from '.';
import {SlackChannel} from '../utils/slack';
import prismaClient from '../utils/prismaClient';

export default async function (
  data: {
    id: string;
  },
  {logger}: JobHelpers,
) {
  const application = await prismaClient.bandApplication.findUniqueOrThrow({
    where: {id: data.id},
    include: {
      event: true,
    },
  });

  const eventYear = application.event.start.getFullYear();
  const isDJ = application.genreCategory === 'DJ';

  const jobs = [
    scheduleTask('sendEmail', {
      template: 'confirmBandApplication',
      variables: {
        bandname: application.bandname,
        eventYear: String(eventYear),
      },
      to: application.email,
      from: isDJ
        ? 'Kulturspektakel Gauting <info@kulturspektakel.de>'
        : 'Kulturspektakel Gauting Booking <booking@kulturspektakel.de>',
    }),
    scheduleTask('bandApplicationDistance', {id: application.id}),
    scheduleTask('slackMessage', {
      channel: isDJ ? SlackChannel.dj : SlackChannel.bandbewerbungen,
      text: `Bewerbung von „${application.bandname}“`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: application.demo
              ? '*<' + application.demo + '|' + application.bandname + '>*'
              : `*${application.bandname}*`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Genre:*\n${application.genre ?? application.genreCategory}`,
            },
            {
              type: 'mrkdwn',
              text: `*Ort:*\n${application.city}`,
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*AnsprechpartnerIn:* ${application.contactName} (${application.contactPhone}) ${application.email}`,
            },
          ],
        },
        {
          type: 'divider',
        },
      ],
    }),
  ];

  if (application.demo) {
    jobs.push(
      scheduleTask(
        'bandApplicationDemo',
        {
          id: application.id,
        },
        {
          maxAttempts: 25,
        },
      ),
    );
  }
  if (application.facebook) {
    jobs.push(scheduleTask('facebookLikes', {id: application.id}));
  }
  if (application.instagram) {
    jobs.push(
      scheduleTask(
        'instagramFollower',
        {id: application.id},
        {
          maxAttempts: 25,
        },
      ),
    );
  }
  if (application.spotifyArtist) {
    jobs.push(
      scheduleTask(
        'spotifyListeners',
        {id: application.id},
        {
          maxAttempts: 25,
        },
      ),
    );
  }

  await Promise.all(jobs);
}
