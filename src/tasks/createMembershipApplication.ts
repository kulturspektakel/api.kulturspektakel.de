import {JobHelpers} from 'graphile-worker';
import {scheduleTask} from '.';
import {SlackChannel} from '../utils/slack';
import {isValid, printFormat} from 'iban-ts';
import {assertNever} from '@pothos/core';
import {config} from '../queries/config';
import {z} from 'zod';

const MEMBERSHIP_FEES = config.membershipFees;

export default async function (
  data: z.infer<typeof schema>,
  {logger}: JobHelpers,
) {
  const iban = printFormat(data.iban, '');
  const ibanMasked = `${iban.substring(0, 5)}${'*'.repeat(iban.length - 8)}${iban.slice(-3)}`;

  const membershipFee = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(
    (data.membershipType === 'supporter'
      ? data.membershipFee
      : MEMBERSHIP_FEES[data.membership][data.membershipType]) / 100,
  );

  const supporter =
    data.membershipType === 'supporter'
      ? ` mit einem Förderbeitrag von ${membershipFee}`
      : '';

  let senderEmail = 'kasse@kulturspektakel.de';
  if (data.membership === 'foerderverein') {
    senderEmail = 'foerderverein@kulturspektakel.de';
  }

  const sender =
    data.membership === 'foerderverein'
      ? (`Förderverein Kulturspektakel Gauting <foerderverein@kulturspektakel.de>` as const)
      : (`Kulturspektakel Gauting Kasse <kasse@kulturspektakel.de>` as const);

  const accountHolder =
    data.accountHolder === 'different'
      ? [
          data.accountHolderName,
          data.accountHolderAddress,
          data.accountHolderCity,
        ]
          .filter(Boolean)
          .join(', ')
      : undefined;

  await Promise.all([
    scheduleTask('slackMessage', {
      channel: SlackChannel.zuschuesse,
      text: `${data.name} ist jetzt Mitglied im ${getLegalName(data.membership)}${supporter}`,
    }),
    scheduleTask('sendEmail', {
      from: 'Kulturspektakel Gauting <info@kulturspektakel.de>',
      to: sender,
      subject: `Mitgliedsantrag ${data.name}`,
      text: `Verein: ${getLegalName(data.membership)}
Datum des Antrags: ${new Date().toLocaleDateString('de-DE')}
Mitgliedsbeitrag: ${membershipFee}
Name: ${data.name}
Adresse: ${data.address}
Ort: ${data.city}
E-Mail: ${data.email}
IBAN: ${data.iban}
${accountHolder ? `Kontoinhaber: ${accountHolder}` : ''}
`,
    }),
    scheduleTask('sendEmail', {
      from: sender,
      to: data.email,
      template: 'confirmMembership',
      variables: {
        iban: ibanMasked,
        senderEmail,
        membership: getLegalName(data.membership),
        membershipFee,
      },
    }),
  ]);
}

// TOOD share with website
const membershipEnum = z.enum(['kult', 'foerderverein']);

const schemaStep1 = z.object({
  membership: membershipEnum,
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  email: z.email(),
});

const baseFieldsSchema = schemaStep1.extend({
  iban: z
    .string()
    .refine((iban: string) => isValid(iban), 'IBAN hat kein gültiges Format'),
});

// Shared account holder fields
const accountHolderDifferentFields = {
  accountHolder: z.literal('different' as const),
  accountHolderName: z.string().min(1),
  accountHolderAddress: z.string().min(1),
  accountHolderCity: z.string().min(1),
};

const accountHolderSameFields = {
  accountHolder: z.literal('same' as const),
};

// Base schemas for each membership type
const kultBaseSchema = baseFieldsSchema.extend({
  membership: z.literal('kult'),
  membershipType: z.enum(['regular', 'reduced']),
});

const foerdervereinRegularReducedSchema = baseFieldsSchema.extend({
  membership: z.literal('foerderverein'),
  membershipType: z.enum(['regular', 'reduced']),
});

const foerdervereinSupporterSchema = baseFieldsSchema.extend({
  membership: z.literal('foerderverein'),
  membershipType: z.literal('supporter'),
  membershipFee: z.coerce.number().min(MEMBERSHIP_FEES.foerderverein.regular),
});

// Schema for kult membership (only regular/reduced allowed)
const kultMembershipSchema = z.discriminatedUnion('accountHolder', [
  kultBaseSchema.extend(accountHolderDifferentFields),
  kultBaseSchema.extend(accountHolderSameFields),
]);

// Schema for foerderverein membership (regular/reduced/supporter allowed)
const foerdervereinMembershipSchema = z.discriminatedUnion('accountHolder', [
  z.discriminatedUnion('membershipType', [
    foerdervereinRegularReducedSchema.extend(accountHolderDifferentFields),
    foerdervereinSupporterSchema.extend(accountHolderDifferentFields),
  ]),
  z.discriminatedUnion('membershipType', [
    foerdervereinRegularReducedSchema.extend(accountHolderSameFields),
    foerdervereinSupporterSchema.extend(accountHolderSameFields),
  ]),
]);

const schemaStep2 = z.discriminatedUnion('membership', [
  kultMembershipSchema,
  foerdervereinMembershipSchema,
]);

export const schema = schemaStep2;

function getLegalName(name: z.infer<typeof membershipEnum>) {
  switch (name) {
    case 'foerderverein':
      return 'Förderverein Kulturspektakel Gauting e.V.';
    case 'kult':
      return 'Kulturspektakel Gauting e.V.';
    default:
      assertNever(name);
  }
}
