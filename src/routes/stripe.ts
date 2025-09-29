import {Hono} from 'hono';
import stripe from 'stripe';
import env from '../utils/env';
import {scheduleTask} from '../tasks';
import {SlackChannel} from '../utils/slack';
import prismaClient from '../utils/prismaClient';
import {DonationSource} from '@prisma/client';

const app = new Hono();

app.post('/webhook', async (c) => {
  const event = stripe.webhooks.constructEvent(
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
  const createdAt = new Date(event.data.object.created);
  const email = event.data.object.customer_email;
  const amount = event.data.object.amount_total;
  const name = event.data.object.custom_fields.find(
    (field) => field.key === 'Name',
  )?.text?.value;
  const message = event.data.object.custom_fields.find(
    (field) => field.key === 'Nachricht',
  )?.text?.value;

  if (!amount) {
    throw new Error('Amount is missing');
  }

  prismaClient.donation.create({
    data: {
      id,
      createdAt,
      email,
      amount,
      name,
      message,
      source: DonationSource.Stripe,
    },
  });

  const currencyFormat = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
  const formattedAmount = currencyFormat.format(amount / 100);
  const nameWithFallback = name || 'Unbekannt';

  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `💰 ${formattedAmount} Spende von *${nameWithFallback}*`,
      },
    },
  ];

  if (message) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `> ${message}`,
      },
    });
  }

  const {
    _sum: {amount: totalAmount = 0},
  } = await prismaClient.donation.aggregate({
    _sum: {
      amount: true,
    },
  });

  if (totalAmount) {
    const goal = 1600000;
    const percentage = Math.round((totalAmount / goal) * 100);
    const full = Math.floor(percentage / 10);

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          '▄'.repeat(full) +
          '▁'.repeat(10 - full) +
          ` ${percentage}% (Insgesamt: ${currencyFormat.format(totalAmount / 100)})`,
      },
    });
  }

  await scheduleTask('slackMessage', {
    channel: SlackChannel.dev,
    text: `💰 ${formattedAmount} Spende von ${nameWithFallback}`,
    blocks,
  });
}

export default app;
