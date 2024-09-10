import {JobHelpers} from 'graphile-worker';
import prismaClient from '../utils/prismaClient';
import bandcamp from 'bandcamp-scraper';
import env from '../utils/env';
import {promisify} from 'util';
import {DemoEmbedType} from '@prisma/client';

export default async function ({id}: {id: string}, {logger}: JobHelpers) {
  const bandApplication = await prismaClient.bandApplication.findUniqueOrThrow({
    where: {id},
  });
  const demo = bandApplication.demo?.split(' ').shift();
  if (demo == null) {
    return;
  }
  const url = new URL(demo);
  const domain = url.hostname.toLowerCase().split('.').slice(-2).join('.');
  let path = url.pathname.split('/');
  let demoEmbed: string | undefined = undefined;
  let demoEmbedType: DemoEmbedType = DemoEmbedType.Unresolvable;

  switch (domain) {
    case 'youtube.com':
      switch (path[1]) {
        case 'watch':
          demoEmbedType = DemoEmbedType.YouTubeVideo;
          demoEmbed = url.searchParams.get('v')?.toString();
          break;
        case 'user':
          // forUsername
          const username = path[2];
          demoEmbedType = DemoEmbedType.YouTubeVideo;
          demoEmbed = await youTubeVideoForUsername(username);
          break;
        case 'playlist':
          demoEmbedType = DemoEmbedType.YouTubePlaylist;
          demoEmbed = url.searchParams.get('list')?.toString();
          break;
        case 'channel':
          const channelId = path[2];
          demoEmbed = await youTubeVideoForChannelId(channelId);
          if (demoEmbed != null) {
            demoEmbedType = DemoEmbedType.YouTubeVideo;
          }
          break;
        case 'c':
          const channelIdForHandle = await youTubeChannelIdForHandle(
            path[2],
            logger,
          );
          demoEmbed = await youTubeVideoForChannelId(channelIdForHandle);
          if (demoEmbed != null) {
            demoEmbedType = DemoEmbedType.YouTubeVideo;
          }
          break;
        default:
          if (path[1] != null) {
            let handle = path[1];
            if (handle.startsWith('@')) {
              handle = handle.substring(1);
            }

            const channelId = await youTubeChannelIdForHandle(handle, logger);
            demoEmbed = await youTubeVideoForChannelId(channelId);
            if (demoEmbed != null) {
              demoEmbedType = DemoEmbedType.YouTubeVideo;
            }
          }
          break;
      }

      break;
    case 'youtu.be':
      demoEmbed = path[1];
      demoEmbedType = DemoEmbedType.YouTubeVideo;
      break;
    case 'bandcamp.com':
      let albumUrl: string | undefined = url.toString();
      if (path[1] === 'track') {
        const track = await promisify(bandcamp.getTrackInfo)(albumUrl);
        if (track?.raw.id != null) {
          demoEmbed = track.raw.id.toString();
          demoEmbedType = DemoEmbedType.BandcampTrack;
          break;
        }
      } else if (path[1] !== 'album') {
        const match = url.hostname.match(/([^.]+)\.bandcamp\.com/i);
        if (match && match?.length > 1) {
          const artist = await promisify(bandcamp.getArtistInfo)(albumUrl);
          albumUrl = artist?.albums?.pop()?.url;
        }
      }

      if (albumUrl != null) {
        const album = await promisify(bandcamp.getAlbumInfo)(albumUrl);
        if (album?.raw.id) {
          demoEmbedType = DemoEmbedType.BandcampAlbum;
          demoEmbed = album.raw.id.toString();
        }
      }
      break;
    case 'soundcloud.com':
      let pathname = url.pathname;
      if (url.host === 'on.soundcloud.com') {
        const res = await fetch(url, {
          redirect: 'follow',
        });
        pathname = new URL(res.url).pathname;
      }

      demoEmbed = pathname;
      demoEmbedType = DemoEmbedType.SoundcloudUrl;
      break;
    case 'spoti.fi':
      const res = await fetch(url, {
        redirect: 'follow',
      });
      console.log(res.url);
      path = new URL(res.url).pathname.split('/');
    // Fallthrough
    case 'spotify.com':
      switch (path[1]) {
        case 'artist':
          demoEmbedType = DemoEmbedType.SpotifyArtist;
          break;
        case 'album':
          demoEmbedType = DemoEmbedType.SpotifyAlbum;
          break;
        case 'track':
          demoEmbedType = DemoEmbedType.SpotifyTrack;
          break;
      }
      if (demoEmbedType !== DemoEmbedType.Unresolvable) {
        demoEmbed = path[2];
      }
      break;
  }

  await prismaClient.bandApplication.update({
    data: {
      demoEmbed,
      demoEmbedType,
    },
    where: {
      id,
    },
  });
}

async function youTubeChannelIdForHandle(
  handle: string | undefined,
  logger: JobHelpers['logger'],
) {
  if (!handle) {
    return;
  }
  const res: {
    kind: 'youtube#channelListResponse';
    etag: 'NotImplemented';
    items: [
      {
        kind: 'youtube#channel';
        etag: 'NotImplemented';
        id: string;
      },
    ];
  } = await fetch(`https://yt.lemnoslife.com/channels?handle=@${handle}`).then(
    (res) =>
      res.json().catch(async (e) => {
        const text = await res.text();
        logger.debug(`${e}: ${text}`);
      }),
  );

  const id = res?.items?.pop()?.id;

  if (id) {
    return id;
  }
  logger.debug(JSON.stringify(res));
}

type YouTubeChannelListResponse = {
  kind: 'youtube#channelListResponse';
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Array<{
    kind: 'youtube#channel';
    etag: string;
    id: string;
    statistics: {
      viewCount: string;
      subscriberCount: string;
      hiddenSubscriberCount: boolean;
      videoCount: string;
    };
    contentDetails: {
      relatedPlaylists: {
        likes: string;
        uploads: string;
      };
    };
    brandingSettings: {
      channel: {
        title: string;
        description?: string;
        unsubscribedTrailer?: string;
      };
    };
  }>;
};

async function youTubeVideoForUsername(forUsername: string) {
  const url = new URL('https://www.googleapis.com/youtube/v3/channels');
  url.searchParams.append('key', env.YOUTUBE_API_KEY);
  url.searchParams.append('part', 'statistics,brandingSettings,contentDetails');
  url.searchParams.append('forUsername', forUsername);

  const res: YouTubeChannelListResponse | YouTubeError = await fetch(url).then(
    (res) => res.json(),
  );

  if (isError(res)) {
    throw new Error(res.error.message);
  }

  if (res.pageInfo.totalResults === 0) {
    return;
  }

  const unsubscribedTrailer =
    res.items[0].brandingSettings.channel.unsubscribedTrailer;
  if (unsubscribedTrailer) {
    return unsubscribedTrailer;
  }

  return youTubeVideoForChannelId(res.items[0].id);
}

type YouTubeChannelSearchResponse = {
  kind: 'youtube#searchListResponse';
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Array<{
    kind: 'youtube#searchResult';
    etag: string;
    id: {
      kind: 'youtube#video';
      videoId: string;
    };
  }>;
};

type YouTubeError = {
  error: {
    code: number;
    message: string;
  };
};

function isError(res: Object | YouTubeError): res is YouTubeError {
  return 'error' in res;
}

async function youTubeVideoForChannelId(channelId: string | undefined) {
  if (!channelId) {
    return;
  }
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.append('key', env.YOUTUBE_API_KEY);
  url.searchParams.append('part', 'snippet');
  url.searchParams.append('maxResults', '1');
  url.searchParams.append('order', 'viewCount');
  url.searchParams.append('type', 'video');
  url.searchParams.append('channelId', channelId);

  const res: YouTubeChannelSearchResponse | YouTubeError = await fetch(
    url,
  ).then((res) => res.json());

  if (isError(res)) {
    throw new Error(res.error.message);
  }

  if (res.items.length > 0) {
    return res.items[0].id.videoId;
  }
}
