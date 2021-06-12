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
): {
  startTime: Date;
  endTime: Date;
} {
  const [hour, minute] = time.split(':').map((i) => parseInt(i, 10));

  const startTime = new Date(date);
  startTime.setHours(hour);
  startTime.setMinutes(minute);

  return {
    startTime: zonedTimeToUtc(startTime, 'Europe/Berlin'),
    endTime: add(zonedTimeToUtc(startTime, 'Europe/Berlin'), {
      minutes: 60, // Website API doesn't provide endtime yet
    }),
  };
}

export default extendType({
  type: 'Area',
  definition: (t) => {
    t.nonNull.list.nonNull.field('bandsPlaying', {
      type: 'Band',
      args: {
        day: nonNull('Date'),
      },
      resolve: async (area, {day}) => {
        const res: ApiError | ApiResponse = await fetch(
          `https://kulturspektakel.de/api/pages/lineup+${day.getFullYear()}/children?select=id,title,content`,
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
            .filter(
              ({content: {stage, day: weekday}}) =>
                stage.toLowerCase() === (area as Area).id.toLowerCase() &&
                isSameWeekDay(day, weekday),
            )
            .sort((a, b) => (a.content.time > b.content.time ? 1 : -1))
            .map(({id, title, content: {genre, description, time}}) => ({
              id,
              name: title,
              ...getStartEndTime(time, day),
              genre: genre ? genre : undefined,
              description: description ? description : undefined,
            }));
        }
        return [];
      },
    });
  },
});
