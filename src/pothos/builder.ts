import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin from '@pothos/plugin-relay';
import prismaClient from '../utils/prismaClient';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import {GraphQLDate, GraphQLDateTime} from 'graphql-scalars';

export const builder = new SchemaBuilder<{
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
  plugins: [PrismaPlugin, RelayPlugin],
  prisma: {
    client: prismaClient,
  },
  relayOptions: {
    // These will become the defaults in the next major version
    clientMutationId: 'omit',
    cursorType: 'String',
  },
});

builder.addScalarType('Date', GraphQLDate, {});
builder.addScalarType('DateTime', GraphQLDateTime, {});

builder.queryType({});
