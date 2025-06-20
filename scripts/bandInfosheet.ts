import readGoogleSheet from '../src/utils/readGoogleSheet';
import sendMail from '../src/utils/sendMail';

const SHEET_ID = '---';
const SHEET_NAME = 'Infosheet';

async function main() {
  const {values} = await readGoogleSheet(SHEET_ID, SHEET_NAME);

  values.shift(); // remove header

  for (let band of values) {
    const [
      day,
      stage,
      getin,
      soundcheck,
      start,
      end,
      bandname,
      fee,
      contact,
      backupContact,
      name,
      email,
    ] = band;

    const eventYear = String(new Date().getFullYear());

    await sendMail(
      'infosheet',
      'Kulturspektakel Gauting Booking <booking@kulturspektakel.de>',
      {
        day,
        stage,
        getin,
        soundcheck,
        start,
        end,
        bandname,
        fee,
        contact,
        backupContact,
        name,
        eventYear,
      },
      {
        to: email,
      },
    );
    console.log(`Sent for ${bandname}`);
  }
}

await main();
