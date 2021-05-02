import nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';
import Mail from 'nodemailer/lib/mailer';

const ses = new aws.SES({
  apiVersion: '2010-12-01',
  region: 'eu-west-2',
});

const transport = nodemailer.createTransport({
  SES: {ses, aws},
});

export default function (data: Mail.Options) {
  return transport.sendMail({
    from: 'info@kulturspektakel.de',
    ...data,
  });
}
