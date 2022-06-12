import {UserInputError} from 'apollo-server-express';
import {extendType, nonNull, objectType} from 'nexus';
import env from '../utils/env';
import {createHash} from 'crypto';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createCardTransaction', {
      type: objectType({
        name: 'CardTransactionInput',
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
      resolve: (_, {cardUri, balanceAfter, depositAfter}) => {
        throw new Error('Not implemented');
      },
    });
  },
});
