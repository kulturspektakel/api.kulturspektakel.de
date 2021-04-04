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
import Reservation from './models/Reservation';
import SlotAvailability from './models/SlotAvailability';
import confirmReservation from './mutations/confirmReservation';
import ReservableTableSlot from './models/ReservationSlot';
import reservations from './queries/reservations';
import cancelReservation from './mutations/cancelReservation';
import reservableSlots from './queries/reservableSlots';
import updateReservation from './mutations/updateReservation';
import Viewer from './models/Viewer';
import viewer from './queries/viewer';
import area from './queries/area';

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
    ReservableTableSlot,
    Reservation,
    ReservationStatus,
    SlotAvailability,
    Table,
    Viewer,

    // type extensions
    reservableSlots,
    areas,
    area,
    reservations,
    viewer,

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
