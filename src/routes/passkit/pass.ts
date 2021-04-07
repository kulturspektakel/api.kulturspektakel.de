import prismaClient from '../../utils/prismaClient';
import env from '../../utils/env';
import {Express} from 'express';
import passkitGenerator from 'passkit-generator';

export default function (app: Express) {
  app.get<{}, any, any, {token?: string}>('/auth', async (req, res) => {
    const {token} = req.query;
    if (!token) {
      res.status(404);
      return res.send('not found');
    }

    const reservation = await prismaClient.reservation.findUnique({
      where: {
        token,
      },
    });

    if (!reservation) {
      res.status(404);
      return res.send('not found');
    }

    const pass = await passkitGenerator.createPass({
      model: {
        thumbnail: Buffer.from(''),
        icon: Buffer.from(''),
        'pass.json': Buffer.from(''),
      },
      certificates: {
        wwdr: './certs/wwdr.pem',
        signerCert: './certs/signercert.pem',
        signerKey: {
          keyFile: './certs/signerkey.pem',
        },
      },
      overrides: {
        serialNumber: 'AAGH44625236dddaffbda',
      },
    });

    res.type('application/vnd.apple.pkpass');
    res.write(pass.generate());
    res.end;
  });
}
