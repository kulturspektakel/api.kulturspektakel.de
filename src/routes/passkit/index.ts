import prismaClient from '../../utils/prismaClient';
import env from '../../utils/env';
import {Express} from 'express';
import {createPass, createAbstractModel} from 'passkit-generator';
import {PrismaClient} from '@prisma/client';
import {Stream} from 'form-data';

const createModel = createAbstractModel({
  model: __dirname + '/../../../artifacts/model',
  certificates: {
    wwdr: __dirname + '/../../../artifacts/AppleWWDRCAG3.pem',
    signerCert:
      __dirname + '/../../../artifacts/pass.de.kulturspektakel.table.pem',
    signerKey: {
      passphrase: env.PASSKIT_KEY,
      keyFile:
        __dirname + '/../../../artifacts/pass.de.kulturspektakel.table.key.pem',
    },
  },
});

export async function getPass(
  prismaClient: PrismaClient,
  token: string,
): Promise<Stream | null> {
  const reservation = await prismaClient.reservation.findUnique({
    where: {
      token,
    },
    include: {
      table: {
        include: {
          area: true,
        },
      },
    },
  });

  if (!reservation) {
    return null;
  }

  const model = await createModel;
  const pass = await createPass(model, undefined, {
    overrides: {
      serialNumber: String(reservation.id),
      authenticationToken: reservation.token,
    },
  });

  pass.barcodes(String(reservation.id));
  pass.headerFields?.push({key: 'id', value: `#${reservation.id}`});
  pass.relevantDate(reservation.startTime);

  pass.primaryFields?.push(
    {
      key: 'date',
      label: 'DATUM',
      value: reservation.startTime.toLocaleDateString('de', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Europe/Berlin',
      }),
    },
    {
      key: 'time',
      label: 'UHRZEIT',
      value:
        reservation.startTime.toLocaleTimeString('de', {
          minute: '2-digit',
          hour: '2-digit',
          timeZone: 'Europe/Berlin',
        }) + ' Uhr',
    },
  );

  pass.secondaryFields?.push(
    {
      key: 'event',
      label: 'BEREICH',
      value: reservation.table.area.displayName,
    },
    {
      key: 'partySize',
      label: 'RESERVIERUNG',
      value: reservation.otherPersons.length + 1 + ' Personen',
    },
    {
      key: 'until',
      label: 'BIS',
      value:
        reservation.endTime.toLocaleTimeString('de', {
          minute: '2-digit',
          hour: '2-digit',
          timeZone: 'Europe/Berlin',
        }) + ' Uhr',
    },
  );

  pass.auxiliaryFields?.push(
    {
      key: 'name',
      label: 'NAME',
      value: reservation.primaryPerson,
    },
    {
      key: 'email',
      label: 'E-MAIL',
      value: reservation.primaryEmail,
    },
  );

  return pass.generate();
}

export default function (app: Express) {
  app.get<{token: string}>('/passkit/:token', async (req, res) => {
    const {token} = req.params;
    const pass = await getPass(prismaClient, token);
    if (!pass) {
      res.status(404);
      return res.send('not found');
    }
    res.set({
      'Content-type': 'application/vnd.apple.pkpass',
      'Content-disposition': `attachment; filename=pass.pkpass`,
    });
    pass.pipe(res);
  });
}
