import {zonedTimeToUtc} from 'date-fns-tz';
import {add} from 'date-fns';
import fetch from 'node-fetch';
import env from './env';

type ApiError = {
  status: 'error';
  message: string;
  code: number;
  key: string;
  details: any;
};

type ApiStage = 'GB' | 'KB' | 'A' | 'WB' | 'DJ';
type ApiDay = 'Freitag' | 'Samstag' | 'Sonntag';

type ApiResponse<T> = {
  status: 'ok';
  code: 200;
  type: 'collection';
  data: Array<{
    content: T;
    files: Array<{
      filename: string;
      url: string;
    }>;
    slug: string;
    id: string;
    title: string;
  }>;
};

function getStartEndTime(
  time: string,
  date: Date,
  day: ApiDay,
): {
  startTime: Date;
  endTime: Date;
} {
  const [hour, minute] = time.split(':').map((i) => parseInt(i, 10));

  const dayOffset: Record<ApiDay, number> = {
    Freitag: 0,
    Samstag: 1,
    Sonntag: 2,
  };

  const startTime = add(date, {
    days: dayOffset[day],
  });
  startTime.setHours(hour);
  startTime.setMinutes(minute);
  startTime.setSeconds(0);
  startTime.setMilliseconds(0);

  return {
    startTime: zonedTimeToUtc(startTime, 'Europe/Berlin'),
    endTime: add(zonedTimeToUtc(startTime, 'Europe/Berlin'), {
      minutes: 60, // Website API doesn't provide endtime yet
    }),
  };
}

const headers = {
  Authorization: `Basic ${Buffer.from(
    `${env.KULT_WEBSITE_API_EMAIL}:${env.KULT_WEBSITE_API_PASSWORD}`,
  ).toString('base64')}`,
};

async function apiRequest<T>(id: string) {
  const res: ApiError | ApiResponse<T> = await fetch(
    `https://kulturspektakel.de/api/pages/${id}/children?select=id,title,content,files,slug&limit=200`,
    {
      headers,
    },
  ).then((res) => res.json());

  if (res.status !== 'ok') {
    throw new Error(res.message);
  }
  return res.data;
}

export async function fetchNews() {
  return apiRequest<{
    text: string;
    date: string;
    title: string;
  }>('home');
}

export async function fetchLineUp(eventStart: Date) {
  const data = await apiRequest<{
    shortdescription: string;
    description: string;
    stage: ApiStage;
    day: ApiDay;
    time: `${string}:${string}:${string}`; // '20:00:00';
    genre: string;
    website: string;
    soundcloud: string;
    twitter: string;
    instagram: string;
    spotify: string;
    title: string;
    facebook: string;
    youtube: string;
  }>(`lineup+${eventStart.getFullYear()}`);

  return data.map(({id, title, files, content: {time, day, stage, ...b}}) => ({
    content: {
      id,
      name: title,
      ...getStartEndTime(time, eventStart, day),
      genre: b.genre || null,
      description: b.description || null,
      shortDescription: b.shortdescription || null,
      soundcloud: b.soundcloud || null,
      spotify: b.spotify || null,
      facebook: b.facebook || null,
      instagram: b.instagram || null,
      website: b.website || null,
      youtube: b.youtube || null,
      areaId: stage.toLocaleLowerCase(),
      slug: id.split('/').pop() ?? '',
      eventId: `kult${eventStart.getFullYear()}`,
    },
    files,
  }));
}
