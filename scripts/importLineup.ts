import slugify from 'slugify';
import env from '../src/utils/env';
import prismaClient from '../src/utils/prismaClient';
import {Prisma} from '@prisma/client';
import {addDays} from 'date-fns';
import {fromZonedTime} from 'date-fns-tz';

const EVENT_ID = 'kult2024';
const SHEET_ID = '11Gpr5UYJQv0bqVaCilqPSbcVlzz-GCGmP1jOdtQrwds';
const SHEET_NAME = 'Lineup';
const ANNOUNCEMENT_TIME = new Date('2024-07-21');
const CLEAR_LINEUP = false;

async function main() {
  const data = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${env.GOOGLE_MAPS_KEY}`,
  );

  const json: {
    range: string;
    majorDimension: string;
    values: string[][];
  } = await data.json();

  const stages = await prismaClient.area.findMany();
  const event = await prismaClient.event.findUniqueOrThrow({
    where: {id: EVENT_ID},
  });

  function datetime(day: string, time: string): Date {
    let d = new Date(event.start);
    if (day.startsWith('Fr')) {
      // nothing
    } else if (day.startsWith('Sa')) {
      d = addDays(d, 1);
    } else if (day.startsWith('So')) {
      d = addDays(d, 2);
    } else {
      throw new Error('Unknown day');
    }

    const [hours, minutes] = time.split(':').map(Number);
    d.setHours(hours, minutes);
    return fromZonedTime(d, 'Europe/Berlin');
  }

  if (CLEAR_LINEUP) {
    await prismaClient.bandPlaying.deleteMany({
      where: {
        eventId: EVENT_ID,
      },
    });
  }

  for (let i = 1; i < json.values.length; i++) {
    let [day, stage, start, end, name, genre, status] = json.values[i].map(
      (v) => v.trim(),
    );

    if (name == '' || status != 'bestätigt') {
      continue;
    }

    const slug = slugify(name.replaceAll(/[\/&]/g, '-'), {
      lower: true,
      locale: 'de',
      strict: true,
    });
    const id = `lineup/${event.start.getFullYear()}/${slug}`;

    const create: Prisma.BandPlayingCreateInput = {
      slug,
      id,
      event: {
        connect: {
          id: EVENT_ID,
        },
      },
      area: {
        connect: {
          id: stages.find((s) => s.displayName === stage)?.id,
        },
      },
      startTime: datetime(day, start),
      endTime: datetime(day, end),
      name,
      genre,
      announcementTime: ANNOUNCEMENT_TIME,
    };

    await prismaClient.bandPlaying
      .upsert({
        where: {id},
        update: create,
        create,
      })
      .catch((e) => {
        console.error(`Error for ${name}`);
        console.error(e);
      });

    console.log(`Added ${name}`);
  }
}
await main();
