import {extendType, idArg, nonNull} from 'nexus';
import Node from '../models/Node';
import {NexusGenAbstractTypeMembers} from '../../types/api';
import UnreachableCaseError from '../utils/UnreachableCaseError';
import {Prisma} from '@prisma/client';
import {ApolloError, UserInputError} from 'apollo-server-express';
import {ResultValue} from 'nexus/dist/core';
import authorization from '../utils/authorization';

function getType(id: string): {
  __typename: NexusGenAbstractTypeMembers['Node'];
  key: string;
} {
  if (!id.includes(':')) {
    throw new UserInputError('ID must be prefixed with typename');
  }
  const [type, ...guid] = id.split(':');
  const __typename = type as NexusGenAbstractTypeMembers['Node'];
  if (!__typename) {
    throw new ApolloError('Unknown type');
  }

  return {__typename, key: guid.join(':')};
}

export default extendType({
  type: 'Query',

  definition: (t) => {
    t.field('node', {
      type: Node,
      authorize: (_, {id}, context) => {
        const {__typename} = getType(id);
        switch (__typename) {
          case 'Device':
            return authorization('user')(_, {id}, context);
          case 'Area':
          case 'Table':
          case 'Event':
          case 'Viewer':
          case 'BandApplication':
            return true;
          default:
            throw new UnreachableCaseError(__typename);
        }
      },
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_parent, {id}, {prisma}) => {
        const {__typename, key} = getType(id);

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
          case 'Viewer':
            delegate = prisma.viewer;
            break;
          case 'BandApplication':
            delegate = prisma.bandApplication;
            break;
          case 'Device':
            delegate = prisma.device;
            break;
          default:
            throw new UnreachableCaseError(__typename);
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
