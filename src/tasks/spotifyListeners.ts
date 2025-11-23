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

  const url = `https://open.spotify.com/artist/${application.spotifyArtist}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP${res.status} ${res.statusText}: ${url}`);
  }

  const data = await res.text();
  const match = data.match(
    /data-testid=\"monthly-listeners-label\">([0-9,]+) monthly/,
  );
  let spotifyMonthlyListeners: number | null = null;
  if (match && match.length > 0) {
    spotifyMonthlyListeners = parseInt(match[1].replace(/\D/g, ''), 10);
  } else if (data.includes(' 0 monthly listeners')) {
    spotifyMonthlyListeners = 0;
  }

  if (spotifyMonthlyListeners != null) {
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
