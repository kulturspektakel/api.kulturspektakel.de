import sgMail from '@sendgrid/mail';
import env from './env';

sgMail.setApiKey(env.SENDGRID_API_KEY);

export default function (
  data: sgMail.MailDataRequired & {from: `${string}@kulturspektakel.de`},
) {
  return sgMail.send.bind(sgMail)({
    templateId: '73699cd5-e337-46a5-a306-e77c6a533198',
    ...data,
  });
}
