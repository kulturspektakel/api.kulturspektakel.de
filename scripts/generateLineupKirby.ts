import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';

const PHASES = new Set<string>(['1']);

const DATA = `Fr. 21.07.2023	Große Bühne	17:30	18:30	TBA	Mundart-Rap	bestätigt	1
  Fr. 21.07.2023	Große Bühne	19:00	20:00	TBA	Funk	bestätigt	2`;

const STAGE: Record<string, string> = {
  'Große Bühne': 'GB',
  Kultbühne: 'KB',
  'Kleine Bühne': 'KB',
  Waldbühne: 'WB',
  DJ: 'DJ',
};

const data = DATA.split('\n').map((s) => {
  let [day, stage, start, end, bandname, genre, status, phase] = s
    .trim()
    .split('\t');
  if (day.startsWith('Fr')) {
    day = 'Freitag';
  } else if (day.startsWith('Sa')) {
    day = 'Samstag';
  } else {
    day = 'Sonntag';
  }
  return {
    bandname,
    stage: STAGE[stage],
    day,
    time: start,
    genre,
    phase,
  };
});

(async () => {
  const dataDir = path.join(__dirname, 'output');

  try {
    await fs.rmdir(dataDir, {recursive: true});
  } catch (e) {}
  await fs.mkdir(dataDir);

  for (const band of data) {
    const folderName = slugify(band.bandname, {
      replacement: '-',
      //   remove: /[^A-Z0-9]/gi, // remove characters that match regex, defaults to `undefined`
      lower: true,
      strict: true,
      locale: 'de', // language code of the locale to use
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });

    const bandDir = path.join(dataDir, folderName);
    await fs.mkdir(bandDir);
    await fs.writeFile(
      path.join(bandDir, 'band.txt'),
      `Title: ${PHASES.has(band.phase) ? band.bandname : 'TBA'}

----

Shortdescription: 

----

Description: 

----

Stage: ${band.stage}

----

Day: ${band.day}

----

Time: ${band.time}:00

----

Genre: ${band.genre}

----

Website: 

----

Facebook: 

----

Soundcloud: 

----

Twitter: 

----

Instagram: 

----

Spotify: 

----

Youtube: 

----

Bandcamp: `,
    );
  }
})();
