import {nexusPrisma} from 'nexus-plugin-prisma';
import prismaClient from './utils/prismaClient';
import {asNexusMethod, fieldAuthorizePlugin, makeSchema} from 'nexus';
import {
  DateResolver,
  DateTimeResolver,
  JSONObjectResolver,
} from 'graphql-scalars';
import {AuthenticationError} from 'apollo-server-express';
import {join} from 'path';
import env from './utils/env';
import areas from './queries/areas';
import Area from './models/Area';
import Table from './models/Table';
import requestReservation from './mutations/requestReservation';
import ReservationStatus from './models/ReservationStatus';
import Node from './models/Node';
import Reservation from './models/Reservation';
import Availability from './models/Availability';
import confirmReservation from './mutations/confirmReservation';
import cancelReservation from './mutations/cancelReservation';
import updateReservation from './mutations/updateReservation';
import Viewer from './models/Viewer';
import viewer from './queries/viewer';
import availability from './queries/availability';
import reservationForToken from './queries/reservationForToken';
import reservationsFromSamePerson from './queries/reservationsFromSamePerson';
import node from './queries/node';
import Band from './models/Band';
import bandsPlaying from './queries/bandsPlaying';
import ProductList from './models/ProductList';
import Product from './models/Product';
import productLists from './queries/productLists';

export default makeSchema({
  contextType: {
    module: join(__dirname, 'context.ts'),
    alias: 'ctx',
    export: 'Context',
  },
  outputs: {
    schema: join(__dirname, '..', 'api.graphql'),
    typegen: join(__dirname, '..', 'types', 'api.d.ts'),
  },
  types: [
    asNexusMethod(JSONObjectResolver, 'json'),
    asNexusMethod(DateTimeResolver, 'dateTime'),
    asNexusMethod(DateResolver, 'date'),

    // models
    Area,
    Reservation,
    ReservationStatus,
    Availability,
    Table,
    Viewer,
    Node,
    Band,
    ProductList,
    Product,

    // type extensions
    availability,
    areas,
    reservationForToken,
    reservationsFromSamePerson,
    viewer,
    node,
    bandsPlaying,
    productLists,

    // mutations
    cancelReservation,
    confirmReservation,
    requestReservation,
    updateReservation,
  ],
  plugins: [
    nexusPrisma({
      prismaClient: () => prismaClient,
    }),
    fieldAuthorizePlugin({
      formatError: () => new AuthenticationError('Not authorized'),
    }),
  ],
  shouldGenerateArtifacts: env.NODE_ENV !== 'production',
});
