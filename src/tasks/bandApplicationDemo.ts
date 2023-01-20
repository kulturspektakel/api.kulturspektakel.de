import {JobHelpers} from 'graphile-worker';
import prismaClient from '../utils/prismaClient';
import bandcamp from 'bandcamp-scraper';

export default async function (
  {id, demo}: {id: string; demo: string},
  {logger}: JobHelpers,
) {
  // TODO
  const url = new URL(demo);
  const domain = url.hostname.toLowerCase().split('.').slice(-2).join('.');
  const path = url.pathname.split('/');
  let demoEmbedUrl = null;

  switch (domain) {
    case 'youtube.com':
      switch (path[1]) {
        case 'watch':
          demoEmbedUrl = `https://www.youtube.com/embed/${url.searchParams.get(
            'v',
          )}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0`;
          break;
        case 'user':
        case 'channel':
        case 'c':
          demoEmbedUrl = `https://www.youtube.com/embed/videoseries?list=${path[2]}`;
          // https://www.youtube.com/embed/videoseries?list=PLLeykLlB1Bft1ib18y4KxXQXdK2EoLgut
          break;
        case 'playlist':
          demoEmbedUrl = `https://www.youtube.com/embed/videoseries?list=${url.searchParams.get(
            'list',
          )}`;
          break;
        default:
        // probably a vanity URL
      }

      break;
    case 'youtu.be':
      demoEmbedUrl = `https://www.youtube.com/embed/${path[1]}?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0`;
      break;
    case 'bandcamp.com':
      const match = url.hostname.match(/([^.]+)\.bandcamp\.com/i);
      if (match && match?.length > 1) {
        bandcamp;
      }
      // <iframe style="border: 0; width: 400px; height: 241px;" src="https://bandcamp.com/EmbeddedPlayer/album=2867773323/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/" seamless></iframe>
      break;
    case 'soundcloud.com':
      demoEmbedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
        demo,
      )}&auto_play=false&show_artwork=false`;
      break;
    case 'spotify.com':
      demoEmbedUrl = `https://open.spotify.com/embed${url.pathname}`;
      break;
  }

  await prismaClient.bandApplication.update({
    data: {
      demoEmbedUrl,
    },
    where: {
      id,
    },
  });
}
