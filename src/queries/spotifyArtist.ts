import fetch from 'node-fetch';
import {builder} from '../pothos/builder';
import env from '../utils/env';
import SpotifyArtist from '../models/SpotifyArtist';

let TOKEN: string | null = null;

async function getSpotifyToken() {
  if (TOKEN) {
    return TOKEN;
  }
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const json: {
    access_token: string;
    token_type: string;
    expires_in: number;
  } = await res.json();

  TOKEN = json.access_token;
  return TOKEN;
}

async function getSpotifyArtists(query: string, retries = 1, limit = 5) {
  const token = await getSpotifyToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query,
    )}&type=artist&market=DE&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (res.status === 429) {
    throw new Error('Spotify API limit reached');
  } else if (res.status === 401) {
    if (retries > 0) {
      TOKEN = null;
      return getSpotifyArtists(query, retries - 1, limit);
    } else {
      throw new Error('Spotify API token expired');
    }
  } else if (res.status !== 200) {
    throw new Error(`Spotify API returned ${res.status}`);
  }

  const json: {
    artists: {
      href: string;
      items: Array<{
        external_urls: {
          spotify: string;
        };
        genres: string[];
        href: string;
        id: string;
        images: Array<{
          height: number;
          url: string;
          width: number;
        }>;
        name: string;
        popularity: number;
        type: string;
        uri: string;
      }>;
      limit: number;
      next: string;
      offset: number;
      previous: null;
      total: number;
    };
  } = await res.json();

  return json.artists.items.map((artist) => ({
    name: artist.name,
    id: artist.id,
    image: artist.images.at(artist.images.length - 1)?.url ?? null,
    genre: artist.genres.at(0) ?? null,
  }));
}

builder.queryField('spotifyArtist', (t) =>
  t.field({
    type: [SpotifyArtist],
    args: {
      query: t.arg.string({required: true}),
      limit: t.arg.int({required: false}),
    },
    resolve: async (_, {query, limit}) =>
      getSpotifyArtists(query, 1, limit ?? 5),
  }),
);
