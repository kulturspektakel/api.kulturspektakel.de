import {GraphQLError} from 'graphql';
import {builder} from '../pothos/builder';
import {scheduleTask} from '../tasks';
import sendMail from '../utils/sendMail';
import {SlackChannel} from '../utils/slack';
import {isValid, printFormat} from 'iban-ts';
import confirmMembership from '../maizzle/mails/confirmMembership';
import {config, MembershipT, MembershipTypeT} from '../queries/config';

export const Membership = builder.enumType('Membership', {
  values: Object.keys(MembershipT) as Array<keyof typeof MembershipT>,
});

export const MembershipType = builder.enumType('MembershipType', {
  values: Object.keys(MembershipTypeT) as Array<keyof typeof MembershipTypeT>,
});

const MembershipApplicationInput = builder.inputType('MembershipApplication', {
  fields: (t) => ({
    membership: t.field({type: Membership, required: true}),
    name: t.string({required: true}),
    address: t.string({required: true}),
    city: t.string({required: true}),
    email: t.string({required: true}),
    iban: t.string({required: true}),
    membershipType: t.field({type: MembershipType, required: true}),
    membershipFee: t.int({required: true}),
    accountHolderName: t.string(),
    accountHolderAddress: t.string(),
    accountHolderCity: t.string(),
  }),
});

builder.mutationField('createMembershipApplication', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      data: t.arg({type: MembershipApplicationInput, required: true}),
    },
    resolve: async (_, {data}) => {
      if (!isValid(data.iban)) {
        throw new GraphQLError('Invalid IBAN');
      }

      const iban = printFormat(data.iban, '');
      const ibanMasked = `${iban.substring(0, 5)}${'*'.repeat(iban.length - 8)}${iban.slice(-3)}`;

      const expectedMembershipFee =
        data.membershipType === MembershipTypeT.supporter
          ? config.membershipFees[data.membership][MembershipTypeT.regular]
          : config.membershipFees[data.membership][data.membershipType];
      if (data.membershipFee < expectedMembershipFee) {
        throw new GraphQLError('Invalid membershipFee');
      }

      const membershipFee = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }).format(data.membershipFee / 100);

      const supporter =
        data.membershipType === MembershipTypeT.supporter
          ? ` mit einem Förderbeitrag von ${membershipFee}`
          : '';

      const sender = 'kasse@kulturspektakel.de';

      return Promise.all([
        scheduleTask('slackMessage', {
          channel: SlackChannel.dev,
          text: `${data.name} ist jetzt Mitglied im ${MembershipT[data.membership]}${supporter}`,
        }),
        sendMail({
          to: sender,
          subject: `Mitgliedsantrag ${data.name}`,
          text: `Verein: ${MembershipT[data.membership]}
Mitgliedsbeitrag: ${membershipFee}
Name: ${data.name}
Adresse: ${data.address}
Ort: ${data.city}
E-Mail: ${data.email}
IBAN: ${data.iban}
Abweichender Kontoinhaber: ${data.accountHolderName ?? ''}
Abweichender Kontoinhaber: ${data.accountHolderAddress ?? ''}
Abweichender Kontoinhaber: ${data.accountHolderCity ?? ''}`,
        }),
        sendMail({
          to: data.email,
          subject: `Mitgliedsantrag ${MembershipT[data.membership]}`,
          html: confirmMembership({
            iban: ibanMasked,
            senderEmail: sender,
            membership: MembershipT[data.membership],
            membershipFee,
          }),
        }),
      ])
        .then(() => true)
        .catch(() => false);
    },
  }),
);
