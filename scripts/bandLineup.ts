import readGoogleSheet from '../src/utils/readGoogleSheet';
import sendMail from '../src/utils/sendMail';

const SHEET_ID = '----';
const SHEET_NAME = 'Lineup';

async function main() {
  const {values} = await readGoogleSheet(SHEET_ID, SHEET_NAME);

  values.shift(); // remove header

  for (let band of values) {
    let [
      day,
      stage,
      start,
      end,
      bandname,
      genre,
      status,
      manager,
      alternatives,
      fullName,
      name,
      phone,
      email,
      rider,
      press,
    ] = band;

    if (!email) {
      continue;
    }

    let missing = false;
    if (phone === '') {
      phone = 'eine Kontaktperson mit Handynummer für den Veranstaltungstag';
      missing = true;
    } else {
      phone = 'TRUE';
    }
    if (rider === 'FALSE') {
      rider = 'euren Tech-Rider';
      missing = true;
    }
    if (press === 'FALSE') {
      press = 'ein Bandfoto und Pressetext';
      missing = true;
    }

    const eventYear = String(new Date().getFullYear());
    console.log(bandname);
    await sendMail(
      'bandLineup',
      'Kulturspektakel Gauting Booking <booking@kulturspektakel.de>',
      {
        bandname,
        name,
        eventYear,
        missingDetails: missing
          ? `Schickt uns bitte möglichst zeitnah noch ${[phone, rider, press].filter((n) => n !== 'TRUE').join(' und ')}.`
          : '',
      },
      {
        to: email,
      },
    );
  }
}

await main();
