import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin from '@pothos/plugin-relay';
import prismaClient from '../utils/prismaClient';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import {GraphQLDate, GraphQLDateTime} from 'graphql-scalars';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import {Context} from '../context';
import {GraphQLError} from 'graphql';

export const builder = new SchemaBuilder<{
  DefaultFieldNullability: false;
  AuthScopes: {
    user: boolean;
    device: boolean;
  };
  Context: Context;
  PrismaTypes: PrismaTypes;
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  defaultFieldNullability: false,
  plugins: [ScopeAuthPlugin, PrismaPlugin, RelayPlugin],
  prisma: {
    client: prismaClient,
    filterConnectionTotalCount: true,
  },
  relay: {
    // These will become the defaults in the next major version
    clientMutationId: 'omit',
    cursorType: 'String',
    decodeGlobalID: (globalID) => {
      const [typename, ...id] = globalID.split(':');
      return {id: id.join(':'), typename};
    },
    encodeGlobalID: (typename, id) => `${typename}:${id}`,
  },
  scopeAuth: {
    treatErrorsAsUnauthorized: true,
    unauthorizedError: () =>
      new GraphQLError(`Not authorized`, {
        extensions: {
          code: 'UNAUTHORIZED',
        },
      }),
    authScopes: async ({parsedToken}) => ({
      user: parsedToken?.iss === 'directus',
      device: parsedToken?.iss === 'device',
    }),
  },
});

builder.addScalarType('Date', GraphQLDate, {});
builder.addScalarType('DateTime', GraphQLDateTime, {});
builder.queryType({});
builder.mutationType({});
