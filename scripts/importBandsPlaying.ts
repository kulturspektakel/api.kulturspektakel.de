require('dotenv').config();

import {fetchLineUp} from '../src/queries/bandsPlaying';
import prismaClient from '../src/utils/prismaClient';

(async () => {
  const year = parseInt(process.argv.pop() ?? '');
  if (!year || year < 2000 || year > 2030) {
    throw new Error('Call with valid year.');
  }

  const date = new Date();
  date.setFullYear(year);
  const data = await fetchLineUp(date);

  console.log(data);

  const a = await prismaClient.bandPlaying.createMany({
    data: data.map(({id, ...b}) => ({
      ...b,
      eventId: `kult${year}`,
      slug: id.split('/').pop() ?? '',
    })),
  });
  console.log(a);
})();
