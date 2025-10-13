import nodemailer from 'nodemailer';
import {SESv2Client, SendEmailCommand} from '@aws-sdk/client-sesv2';
import Mail from 'nodemailer/lib/mailer';
import mails from '../maizzle/generated';

const sesClient = new SESv2Client({
  apiVersion: '2010-12-01',
  region: 'eu-west-2',
});

const transport = nodemailer.createTransport({
  // @ts-ignore
  SES: {sesClient, SendEmailCommand},
});

type From =
  | 'Kulturspektakel Gauting Booking <booking@kulturspektakel.de>'
  | 'Kulturspektakel Gauting <info@kulturspektakel.de>'
  | 'Förderverein Kulturspektakel Gauting <foerderverein@kulturspektakel.de>'
  | 'Kulturspektakel Gauting Kasse <kasse@kulturspektakel.de>';

export function sendRawMail(
  data: Mail.Options & {
    from: From;
    to: string;
    subject: string;
    text: string;
  },
) {
  return transport.sendMail(data);
}

export default function <T extends keyof typeof mails>(
  mail: T,
  from: From,
  variables: Parameters<(typeof mails)[T]>[0],
  data: Omit<Mail.Options, T | 'from'>,
) {
  return transport.sendMail({
    from,
    ...mails[mail](variables as any),
    ...data,
  });
}
