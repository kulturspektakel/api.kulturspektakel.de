import prismaClient from '../utils/prismaClient';
import {JobHelpers} from 'graphile-worker';

export default async function ({id}: {id: string}, {logger}: JobHelpers) {
  const application = await prismaClient.bandApplication.findUnique({
    where: {
      id,
    },
  });
  if (!application?.spotifyArtist) {
    return;
  }

  const res = await fetch(
    `https://open.spotify.com/artist/${application.spotifyArtist}`,
  ).then((res) => res.text());

  const match = res.match(
    /data-testid=\"monthly-listeners-label\".+>([0-9,]+) monthly/,
  );

  if (match && match.length > 0) {
    const spotifyMonthlyListeners = parseInt(match[1].replace(/\D/g, ''), 10);
    await prismaClient.bandApplication.update({
      data: {
        spotifyMonthlyListeners,
      },
      where: {
        id,
      },
    });
  } else {
    throw new Error(
      `Could not find monthly listeners for ${application.spotifyArtist}`,
    );
  }
}
