import {JobHelpers} from 'graphile-worker';
import {From, transport} from '../utils/sendMail';
import Mail from 'nodemailer/lib/mailer';
import mails from '../maizzle/generated';

export default async function <T extends keyof typeof mails>(
  data: Omit<Mail.Options, 'from' | 'to' | 'subject' | 'text' | 'html'> & {
    from: From;
    to: NonNullable<Mail.Options['to']>;
  } & (
      | {
          template: T;
          variables: Parameters<(typeof mails)[T]>[0];
        }
      | {
          subject: string;
          text: string;
        }
    ),
  {logger}: JobHelpers,
) {
  if ('template' in data) {
    const {template, variables, ...rest} = data;
    await transport.sendMail({
      ...mails[template](variables as any),
      ...rest,
    });
  } else {
    await transport.sendMail(data);
  }
}
