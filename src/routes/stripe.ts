import {Hono} from 'hono';
import stripe from 'stripe';
import env from '../utils/env';
import {scheduleTask} from '../tasks';
import {SlackChannel} from '../utils/slack';
import prismaClient from '../utils/prismaClient';
import sendMail from '../utils/sendMail';
import {DonationSource} from '../../types/prisma/enums';

const app = new Hono();

app.post('/webhook', async (c) => {
  const event = await stripe.webhooks.constructEventAsync(
    await c.req.text(),
    c.req.header('stripe-signature')!,
    env.STRIPE_SIGNING_SECRET,
  );

  switch (event.type) {
    case 'checkout.session.completed':
      await checkoutSessionCompleted(event);
      break;
  }

  return c.json({message: 'Webhook received'}, {status: 200});
});

async function checkoutSessionCompleted(
  event: stripe.CheckoutSessionCompletedEvent,
) {
  const id = event.data.object.id;
  const createdAt = new Date(event.data.object.created * 1000);
  const email =
    event.data.object.customer_email ||
    event.data.object.customer_details?.email;
  const amount = event.data.object.amount_total;
  const name = event.data.object.custom_fields.find(
    (field) => field.key === 'name',
  )?.text?.value;

  if (!amount) {
    throw new Error('Amount is missing');
  }

  const donation = await prismaClient.donation.create({
    data: {
      reference: id,
      createdAt,
      email,
      amount,
      name,
      source: DonationSource.Stripe,
    },
  });

  const currencyFormat = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
  const formattedAmount = currencyFormat.format(amount / 100);
  const nameWithFallback = name || 'Unbekannt';

  await scheduleTask('slackMessage', {
    channel: SlackChannel.zuschuesse,
    text: `💰 ${formattedAmount} Spende von ${nameWithFallback}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `💰 ${formattedAmount} Spende von *${nameWithFallback}*`,
        },
      },
    ],
  });

  if (email) {
    await sendMail(
      'donation',
      'Kulturspektakel Gauting Kasse <kasse@kulturspektakel.de>',
      {
        link: `https://www.kulturspektakel.de/spenden/quittung/${donation.id}`,
      },
      {
        to: email,
      },
    );
  }
}

export default app;
