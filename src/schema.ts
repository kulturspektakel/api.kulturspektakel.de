import {asNexusMethod, enumType, fieldAuthorizePlugin, makeSchema} from 'nexus';
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
import OpeningHour from './models/OpeningHour';
import TableAvailability from './models/TableAvailability';
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
import ProductList from './models/ProductList';
import Product from './models/Product';
import productLists from './queries/productLists';
import Order from './models/Order';
import createOrder from './mutations/createOrder';
import OrderPayment from './models/OrderPayment';
import OrderItem from './models/OrderItem';
import checkInReservation from './mutations/checkInReservation';
import config from './queries/config';
import availableCapacity from './queries/availableCapacity';
import updateReservationOtherPersons from './mutations/updateReservationOtherPersons';
import createReservation from './mutations/createReservation';
import reservationsByPerson from './queries/reservationsByPerson';
import upsertProductList from './mutations/upsertProductList';
import swapReservations from './mutations/swapReservations';
import Device from './models/Device';
import devices from './queries/devices';
import TimeGrouping from './models/TimeGrouping';
import {CardTransactionType, TableType} from 'nexus-prisma';
import productList from './queries/productList';
import BandApplication from './models/BandApplication';
import createBandApplication from './mutations/createBandApplication';
import distanceToKult from './queries/distanceToKult';
import Event from './models/Event';
import events from './queries/events';
import markBandApplicationContacted from './mutations/markBandApplicationContacted';
import rateBandApplication from './mutations/rateBandApplication';
import BandApplicationRating from './models/BandApplicationRating';
import nuclino from './queries/nuclino';
import {bandsPlayingArea, bandsPlayingEvent} from './queries/bandsPlaying';
import createCardTransaction from './mutations/createCardTransaction';
import updateDeviceProductList from './mutations/updateDeviceProductList';
import CardTransaction from './models/CardTransaction';
import cardStatus, {MissingTransaction} from './queries/cardStatus';
import transactions from './queries/transactions';
import Card from './models/Card';

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
    OpeningHour,
    TableAvailability,
    Table,
    Viewer,
    Node,
    Band,
    ProductList,
    Product,
    Order,
    OrderPayment,
    OrderItem,
    Device,
    TimeGrouping,
    enumType(TableType),
    BandApplication,
    BandApplicationRating,
    Event,
    CardTransaction,
    enumType(CardTransactionType),
    MissingTransaction,
    Card,

    // type extensions
    availability,
    areas,
    reservationForToken,
    reservationsFromSamePerson,
    viewer,
    node,
    bandsPlayingArea,
    bandsPlayingEvent,
    productLists,
    config,
    availableCapacity,
    updateReservationOtherPersons,
    reservationsByPerson,
    devices,
    productList,
    distanceToKult,
    events,
    nuclino,
    cardStatus,
    transactions,

    // mutations
    cancelReservation,
    confirmReservation,
    requestReservation,
    updateReservation,
    checkInReservation,
    createOrder,
    createReservation,
    upsertProductList,
    swapReservations,
    createBandApplication,
    markBandApplicationContacted,
    rateBandApplication,
    createCardTransaction,
    updateDeviceProductList,
  ],
  plugins: [
    fieldAuthorizePlugin({
      formatError: () => new AuthenticationError('Not authorized'),
    }),
  ],
  shouldGenerateArtifacts: env.NODE_ENV !== 'production',
});
