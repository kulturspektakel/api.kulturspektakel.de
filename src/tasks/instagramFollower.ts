import prismaClient from '../utils/prismaClient';
import {JobHelpers} from 'graphile-worker';
import fetch from 'node-fetch';

export default async function ({id}: {id: string}, {logger}: JobHelpers) {
  const application = await prismaClient.bandApplication.findUnique({
    where: {
      id,
    },
  });

  if (!application?.instagram) {
    return;
  }

  const text = await fetch(
    `https://www.instagram.com/${application.instagram}/`,
  ).then((r) => r.text());

  const match = text.match(/"userInteractionCount":(\d+)/);
  if (match && match?.length > 1) {
    await prismaClient.bandApplication.update({
      data: {
        facebookLikes: parseInt(match[1], 10),
      },
      where: {
        id,
      },
    });
  }
}
