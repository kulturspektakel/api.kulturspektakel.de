import nodemailer from 'nodemailer';
import {SESv2Client, SendEmailCommand} from '@aws-sdk/client-sesv2';
import Mail from 'nodemailer/lib/mailer';
import mails from '../maizzle/generated';

const sesClient = new SESv2Client({
  apiVersion: '2010-12-01',
  region: 'eu-west-2',
});

export const transport = nodemailer.createTransport({
  SES: {sesClient, SendEmailCommand},
});

export type From =
  | 'Kulturspektakel Gauting Booking <booking@kulturspektakel.de>'
  | 'Kulturspektakel Gauting <info@kulturspektakel.de>'
  | 'Förderverein Kulturspektakel Gauting <foerderverein@kulturspektakel.de>'
  | 'Kulturspektakel Gauting Kasse <kasse@kulturspektakel.de>';

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
