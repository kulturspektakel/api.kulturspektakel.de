import sgMail from '@sendgrid/mail';
import env from './env';

sgMail.setApiKey(env.SENDGRID_API_KEY);

export default function (data: Omit<sgMail.MailDataRequired, 'from'>) {
  return sgMail.send.bind(sgMail)({
    // templateId: '73699cd5-e337-46a5-a306-e77c6a533198',
    from: {
      email: 'info@kulturspektakel.de',
      name: 'Kulturspektakel Gauting',
    },
    ...data,
  } as sgMail.MailDataRequired);
}
