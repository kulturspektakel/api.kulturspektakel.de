import {UserInputError} from 'apollo-server-express';
import {extendType, nonNull, objectType} from 'nexus';
import env from '../utils/env';
import {createHash} from 'crypto';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('cardTransaction', {
      type: objectType({
        name: 'CardTransaction',
        definition(t) {
          t.nonNull.field({name: 'password', type: 'String'});
          t.nonNull.field({name: 'pack', type: 'String'});
          t.nonNull.field({name: 'payload', type: 'String'});
        },
      }),
      authorize: authorization('user'),
      args: {
        cardUri: nonNull('String'),
        balanceAfter: nonNull('Int'),
        depositAfter: nonNull('Int'),
      },
      resolve: async (_, {cardUri, balanceAfter, depositAfter}) => {
        const match = cardUri.match(
          /\/([A-F0-9]+)\/([0-9]{4})([0-9]{1})([0-9a-f]+)$/,
        );

        if (match?.length !== 5) {
          throw new UserInputError('Invalid cardUri');
        }

        const [
          __,
          cardId,
          balanceBeforeStr,
          depositBeforeStr,
          signatureBefore,
        ] = match;

        if (
          signatureBefore !==
          calculateSignature(
            parseInt(balanceBeforeStr, 10),
            parseInt(depositBeforeStr, 10),
            cardId,
          )
        ) {
          throw new UserInputError('Invalid signature');
        }

        if (balanceAfter < 0 || balanceAfter > 9999) {
          throw new UserInputError('Invalid balanceAfter');
        }
        if (depositAfter < 0 || depositAfter > 9) {
          throw new UserInputError('Invalid depositAfter');
        }

        const signature = calculateSignature(
          balanceAfter,
          depositAfter,
          cardId,
        );

        return {
          ...calculatePassword(cardId),
          payload: `${balanceAfter
            .toString()
            .padStart(4, '0')}${depositAfter}${signature}`,
        };
      },
    });
  },
});

function calculateSignature(
  balance: number,
  deposit: number,
  cardId: string,
): string {
  return createHash('sha1')
    .update(`${balance}${deposit}${cardId}${env.CONTACTLESS_SALT}`)
    .digest('hex')
    .substring(0, 10);
}

function calculatePassword(cardId: string): {password: string; pack: string} {
  const hash = createHash('sha1')
    .update(`${cardId}${env.CONTACTLESS_SALT}`)
    .digest('hex');

  return {
    password: hash.substring(32),
    pack: hash.substring(28, 32),
  };
}
