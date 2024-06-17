import infosheet from '../src/maizzle/mails/infosheet';
import readGoogleSheet from '../src/utils/readGoogleSheet';
import sendMail from '../src/utils/sendMail';

const SHEET_ID = '---------';
const SHEET_NAME = 'Infosheets';

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

    console.log(bandname, email);
    await sendMail({
      to: email,
      from: 'Kulturspektakel Gauting Booking <booking@kulturspektakel.de>',
      subject: `Informationen zum Auftritt „${bandname}“ - Kulturspektakel ${eventYear}`,
      html: infosheet({
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
      }),
    });
  }
}

await main();
