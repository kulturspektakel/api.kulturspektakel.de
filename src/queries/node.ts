import {extendType, idArg, nonNull} from 'nexus';
import Node from '../models/Node';
import {NexusGenAbstractTypeMembers} from '../../types/api';
import UnreachableCaseError from '../utils/UnreachableCaseError';
import {Prisma} from '@prisma/client';
import {ApolloError, UserInputError} from 'apollo-server-express';
import {ResultValue} from 'nexus/dist/core';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.field('node', {
      type: Node,
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_parent, {id}, {prisma}) => {
        if (!id.includes(':')) {
          throw new UserInputError('ID must be prefixed with typename');
        }
        const [type, ...guid] = id.split(':');
        const __typename = type as NexusGenAbstractTypeMembers['Node'];
        if (!__typename) {
          throw new ApolloError('Unknown type');
        }

        const key = guid.join(':');

        let delegate;
        switch (__typename) {
          case 'Area':
            delegate = prisma.area;
            break;
          case 'Table':
            delegate = prisma.table;
            break;
          case 'Event':
            delegate = prisma.event;
            break;
          case 'BandApplication':
            delegate = prisma.bandApplication;
            break;
          default:
            new UnreachableCaseError(__typename);
            return null;
        }

        const node: ResultValue<'Query', 'node'> | null = await (
          delegate as Prisma.AreaDelegate<any>
        ).findUnique({
          where: {
            id: key,
          },
        });

        if (!node) {
          return null;
        }

        return {__typename, ...node};
      },
    });
  },
});
