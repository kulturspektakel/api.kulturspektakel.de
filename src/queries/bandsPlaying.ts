import {Area} from '@prisma/client';
import {zonedTimeToUtc} from 'date-fns-tz';
import {add} from 'date-fns';
import {extendType, nonNull} from 'nexus';
import fetch from 'node-fetch';
import env from '../utils/env';

type ApiError = {
  status: 'error';
  message: string;
  code: number;
  key: string;
  details: any;
};

type ApiStage = 'GB' | 'KB' | 'A' | 'WB' | 'DJ';
type ApiDay = 'Freitag' | 'Samstag' | 'Sonntag';

type ApiResponse = {
  status: 'ok';
  code: 200;
  type: 'collection';
  data: Array<{
    content: {
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
    };
    id: string;
    title: string;
  }>;
};

function isSameWeekDay(date: Date, day: ApiDay): boolean {
  return (
    (date.getDay() === 5 && day === 'Freitag') ||
    (date.getDay() === 6 && day === 'Samstag') ||
    (date.getDay() === 0 && day === 'Sonntag')
  );
}

function getStartEndTime(
  time: string,
  date: Date,
  day: ApiDay,
  b: any,
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

  console.log(b);

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

export const bandsPlayingArea = extendType({
  type: 'Area',
  definition: (t) => {
    t.nonNull.list.nonNull.field('bandsPlaying', {
      type: 'Band',
      args: {
        day: nonNull('Date'),
      },
      resolve: (area, {day}) =>
        fetchLineUp(
          day,
          ({stage, day: weekday}) =>
            stage.toLowerCase() === (area as Area).id.toLowerCase() &&
            isSameWeekDay(day, weekday),
        ),
    });
  },
});

export const bandsPlayingEvent = extendType({
  type: 'Event',
  definition: (t) => {
    t.nonNull.list.nonNull.field('bandsPlaying', {
      type: 'Band',
      resolve: ({start}) => fetchLineUp(start),
    });
  },
});

export async function fetchLineUp(
  eventStart: Date,
  filter: (item: ApiResponse['data'][number]['content']) => boolean = () =>
    true,
) {
  const res: ApiError | ApiResponse = await fetch(
    `https://kulturspektakel.de/api/pages/lineup+${eventStart.getFullYear()}/children?select=id,title,content`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${env.KULT_WEBSITE_API_EMAIL}:${env.KULT_WEBSITE_API_PASSWORD}`,
        ).toString('base64')}`,
      },
    },
  ).then((res) => res.json());
  if (res.status === 'ok') {
    return res.data
      .filter(({content}) => filter(content))
      .sort((a, b) => {
        if (a.content.day == b.content.day) {
          return a.content.time > b.content.time ? 1 : -1;
        }
        return a.content.day > b.content.day ? 1 : -1;
      })
      .map(({id, title, content: {time, day, stage, ...b}}) => ({
        id,
        name: title,
        ...getStartEndTime(time, eventStart, day, {stage, ...b, day}),
        genre: b.genre || undefined,
        description: b.description || undefined,
        shortDescription: b.shortdescription || undefined,
        soundcloud: b.soundcloud || undefined,
        spotify: b.spotify || undefined,
        facebook: b.facebook || undefined,
        instagram: b.instagram || undefined,
        website: b.website || undefined,
        youtube: b.youtube || undefined,
        areaId: stage.toLocaleLowerCase(),
      }));
  }
  return [];
}
