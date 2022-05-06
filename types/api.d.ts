/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context as ctx } from "./../src/context"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "JSONObject";
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    dateTime<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
    /**
     * A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Date";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JSONObject";
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    dateTime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
    /**
     * A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Date";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  CreateBandApplicationInput: { // input type
    bandname: string; // String!
    city: string; // String!
    contactName: string; // String!
    contactPhone: string; // String!
    demo: string; // String!
    description: string; // String!
    email: string; // String!
    facebook?: string | null; // String
    genre?: string | null; // String
    genreCategory: NexusGenEnums['GenreCategory']; // GenreCategory!
    hasPreviouslyPlayed?: NexusGenEnums['PreviouslyPlayed'] | null; // PreviouslyPlayed
    heardAboutBookingFrom?: NexusGenEnums['HeardAboutBookingFrom'] | null; // HeardAboutBookingFrom
    instagram?: string | null; // String
    knowsKultFrom?: string | null; // String
    numberOfArtists: number; // Int!
    numberOfNonMaleArtists: number; // Int!
    website?: string | null; // String
  }
  OrderItemInput: { // input type
    amount: number; // Int!
    name: string; // String!
    note?: string | null; // String
    perUnitPrice: number; // Int!
    productListId?: number | null; // Int
  }
  ProductInput: { // input type
    name: string; // String!
    price: number; // Int!
    requiresDeposit?: boolean | null; // Boolean
  }
}

export interface NexusGenEnums {
  GenreCategory: "Blues_Funk_Jazz_Soul" | "Elektro_HipHop" | "Folk_SingerSongwriter_Country" | "Hardrock_Metal_Punk" | "Indie" | "Other" | "Pop" | "Reggae_Ska" | "Rock"
  HeardAboutBookingFrom: "BYon" | "Facebook" | "Friends" | "Instagram" | "Newspaper" | "Website"
  OrderPayment: "BON" | "CASH" | "FREE_BAND" | "FREE_CREW" | "KULT_CARD" | "SUM_UP" | "VOUCHER"
  PreviouslyPlayed: "No" | "OtherFormation" | "Yes"
  ReservationStatus: "CheckedIn" | "Confirmed" | "Pending"
  TableType: "ISLAND" | "TABLE"
  TimeGrouping: "Day" | "Hour"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  Date: any
  DateTime: any
  JSONObject: any
}

export interface NexusGenObjects {
  Area: { // root type
    displayName: string; // String!
    id: string; // ID!
    themeColor: string; // String!
  }
  Band: { // root type
    description?: string | null; // String
    endTime: NexusGenScalars['DateTime']; // DateTime!
    genre?: string | null; // String
    id: string; // ID!
    name: string; // String!
    startTime: NexusGenScalars['DateTime']; // DateTime!
  }
  BandApplication: { // root type
    bandname: string; // String!
    city: string; // String!
    contactName: string; // String!
    contactPhone: string; // String!
    demo?: string | null; // String
    description?: string | null; // String
    distance?: number | null; // Float
    email: string; // String!
    facebook?: string | null; // String
    facebookLikes?: number | null; // Int
    genre?: string | null; // String
    genreCategory: NexusGenEnums['GenreCategory']; // GenreCategory!
    hasPreviouslyPlayed?: NexusGenEnums['PreviouslyPlayed'] | null; // PreviouslyPlayed
    heardAboutBookingFrom?: NexusGenEnums['HeardAboutBookingFrom'] | null; // HeardAboutBookingFrom
    id: string; // ID!
    instagram?: string | null; // String
    instagramFollower?: number | null; // Int
    knowsKultFrom?: string | null; // String
    numberOfArtists?: number | null; // Int
    numberOfNonMaleArtists?: number | null; // Int
    website?: string | null; // String
  }
  BandApplicationRating: { // root type
    rating: number; // Int!
  }
  Board: { // root type
    chair: string; // String!
    deputy: string; // String!
    deputy2: string; // String!
    observer: string; // String!
    observer2: string; // String!
    secretary: string; // String!
    treasurer: string; // String!
  }
  CardTransaction: { // root type
    pack: string; // String!
    password: string; // String!
    payload: string; // String!
  }
  Config: { // root type
    board?: NexusGenRootTypes['Board'] | null; // Board
    depositValue: number; // Int!
    reservationStart: NexusGenScalars['DateTime']; // DateTime!
  }
  Device: { // root type
    id: string; // ID!
    lastSeen?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Event: { // root type
    bandApplicationEnd?: NexusGenScalars['DateTime'] | null; // DateTime
    bandApplicationStart?: NexusGenScalars['DateTime'] | null; // DateTime
    end: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    name: string; // String!
    start: NexusGenScalars['DateTime']; // DateTime!
  }
  HistoricalProduct: { // root type
    name: string; // String!
    productListId: number; // Int!
  }
  Mutation: {};
  NuclinoPage: { // root type
    id: string; // ID!
    lastUpdatedAt: NexusGenScalars['DateTime']; // DateTime!
    title: string; // String!
  }
  NuclinoSearchResult: { // root type
    highlight: string; // String!
    page: NexusGenRootTypes['NuclinoPage']; // NuclinoPage!
  }
  NuclinoUser: { // root type
    email: string; // String!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
  }
  OpeningHour: { // root type
    endTime: NexusGenScalars['DateTime']; // DateTime!
    startTime: NexusGenScalars['DateTime']; // DateTime!
  }
  Order: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    deposit: number; // Int!
    deviceId?: string | null; // String
    id: number; // Int!
    payment: NexusGenEnums['OrderPayment']; // OrderPayment!
  }
  OrderItem: { // root type
    amount: number; // Int!
    id: number; // Int!
    name: string; // String!
    note?: string | null; // String
    perUnitPrice: number; // Int!
  }
  Product: { // root type
    id: number; // Int!
    name: string; // String!
    price: number; // Int!
    productListId: number; // Int!
    requiresDeposit: boolean; // Boolean!
  }
  ProductList: { // root type
    active: boolean; // Boolean!
    emoji?: string | null; // String
    id: number; // Int!
    name: string; // String!
  }
  Query: {};
  Reservation: { // root type
    checkInTime?: NexusGenScalars['DateTime'] | null; // DateTime
    checkedInPersons: number; // Int!
    endTime: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    note?: string | null; // String
    otherPersons: string[]; // [String!]!
    primaryEmail: string; // String!
    primaryPerson: string; // String!
    startTime: NexusGenScalars['DateTime']; // DateTime!
    status: NexusGenEnums['ReservationStatus']; // ReservationStatus!
    tableId: string; // String!
    token: string; // String!
  }
  ReservationByPerson: { // root type
    email: string; // String!
    reservations: NexusGenRootTypes['Reservation'][]; // [Reservation!]!
  }
  SalesNumber: { // root type
    count: number; // Int!
    total: number; // Float!
  }
  Table: { // root type
    displayName: string; // String!
    id: string; // ID!
    maxCapacity: number; // Int!
    type: NexusGenEnums['TableType']; // TableType!
  }
  TableAvailability: { // root type
    endTime: NexusGenScalars['DateTime']; // DateTime!
    startTime: NexusGenScalars['DateTime']; // DateTime!
    tableType: NexusGenEnums['TableType']; // TableType!
  }
  TimeSeries: { // root type
    time: NexusGenScalars['DateTime']; // DateTime!
    value: number; // Int!
  }
  Viewer: { // root type
    displayName: string; // String!
    email: string; // String!
    id: string; // ID!
    profilePicture?: string | null; // String
  }
}

export interface NexusGenInterfaces {
  Billable: NexusGenRootTypes['Device'] | NexusGenRootTypes['HistoricalProduct'] | NexusGenRootTypes['Product'] | NexusGenRootTypes['ProductList'];
  Node: NexusGenRootTypes['Area'] | NexusGenRootTypes['BandApplication'] | NexusGenRootTypes['Event'] | NexusGenRootTypes['Table'] | NexusGenRootTypes['Viewer'];
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenInterfaces & NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Area: { // field return type
    availability: NexusGenRootTypes['TableAvailability'][]; // [TableAvailability!]!
    availableTables: number; // Int!
    bandsPlaying: NexusGenRootTypes['Band'][]; // [Band!]!
    displayName: string; // String!
    id: string; // ID!
    openingHour: NexusGenRootTypes['OpeningHour'][]; // [OpeningHour!]!
    table: NexusGenRootTypes['Table'][]; // [Table!]!
    themeColor: string; // String!
  }
  Band: { // field return type
    description: string | null; // String
    endTime: NexusGenScalars['DateTime']; // DateTime!
    genre: string | null; // String
    id: string; // ID!
    name: string; // String!
    startTime: NexusGenScalars['DateTime']; // DateTime!
  }
  BandApplication: { // field return type
    bandApplicationRating: NexusGenRootTypes['BandApplicationRating'][]; // [BandApplicationRating!]!
    bandname: string; // String!
    city: string; // String!
    contactName: string; // String!
    contactPhone: string; // String!
    contactedByViewer: NexusGenRootTypes['Viewer'] | null; // Viewer
    demo: string | null; // String
    description: string | null; // String
    distance: number | null; // Float
    email: string; // String!
    facebook: string | null; // String
    facebookLikes: number | null; // Int
    genre: string | null; // String
    genreCategory: NexusGenEnums['GenreCategory']; // GenreCategory!
    hasPreviouslyPlayed: NexusGenEnums['PreviouslyPlayed'] | null; // PreviouslyPlayed
    heardAboutBookingFrom: NexusGenEnums['HeardAboutBookingFrom'] | null; // HeardAboutBookingFrom
    id: string; // ID!
    instagram: string | null; // String
    instagramFollower: number | null; // Int
    knowsKultFrom: string | null; // String
    numberOfArtists: number | null; // Int
    numberOfNonMaleArtists: number | null; // Int
    rating: number | null; // Float
    website: string | null; // String
  }
  BandApplicationRating: { // field return type
    rating: number; // Int!
    viewer: NexusGenRootTypes['Viewer']; // Viewer!
  }
  Board: { // field return type
    chair: string; // String!
    deputy: string; // String!
    deputy2: string; // String!
    observer: string; // String!
    observer2: string; // String!
    secretary: string; // String!
    treasurer: string; // String!
  }
  CardTransaction: { // field return type
    pack: string; // String!
    password: string; // String!
    payload: string; // String!
  }
  Config: { // field return type
    board: NexusGenRootTypes['Board'] | null; // Board
    depositValue: number; // Int!
    reservationStart: NexusGenScalars['DateTime']; // DateTime!
  }
  Device: { // field return type
    id: string; // ID!
    lastSeen: NexusGenScalars['DateTime'] | null; // DateTime
    productList: NexusGenRootTypes['ProductList'] | null; // ProductList
    salesNumbers: NexusGenRootTypes['SalesNumber']; // SalesNumber!
  }
  Event: { // field return type
    bandApplication: NexusGenRootTypes['BandApplication'][]; // [BandApplication!]!
    bandApplicationEnd: NexusGenScalars['DateTime'] | null; // DateTime
    bandApplicationStart: NexusGenScalars['DateTime'] | null; // DateTime
    bandsPlaying: NexusGenRootTypes['Band'][]; // [Band!]!
    end: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    name: string; // String!
    start: NexusGenScalars['DateTime']; // DateTime!
  }
  HistoricalProduct: { // field return type
    name: string; // String!
    productListId: number; // Int!
    salesNumbers: NexusGenRootTypes['SalesNumber']; // SalesNumber!
  }
  Mutation: { // field return type
    cancelReservation: boolean | null; // Boolean
    cardTransaction: NexusGenRootTypes['CardTransaction'] | null; // CardTransaction
    checkInReservation: NexusGenRootTypes['Reservation'] | null; // Reservation
    confirmReservation: NexusGenRootTypes['Reservation'] | null; // Reservation
    createBandApplication: NexusGenRootTypes['BandApplication'] | null; // BandApplication
    createOrder: NexusGenRootTypes['Order'] | null; // Order
    createReservation: NexusGenRootTypes['Reservation'] | null; // Reservation
    markBandApplicationContacted: NexusGenRootTypes['BandApplication'] | null; // BandApplication
    rateBandApplication: NexusGenRootTypes['BandApplication'] | null; // BandApplication
    requestReservation: boolean; // Boolean!
    swapReservations: boolean | null; // Boolean
    updateReservation: NexusGenRootTypes['Reservation'] | null; // Reservation
    updateReservationOtherPersons: NexusGenRootTypes['Reservation'] | null; // Reservation
    upsertProductList: NexusGenRootTypes['ProductList'] | null; // ProductList
  }
  NuclinoPage: { // field return type
    content: string; // String!
    id: string; // ID!
    lastUpdatedAt: NexusGenScalars['DateTime']; // DateTime!
    lastUpdatedUser: NexusGenRootTypes['NuclinoUser']; // NuclinoUser!
    title: string; // String!
  }
  NuclinoSearchResult: { // field return type
    highlight: string; // String!
    page: NexusGenRootTypes['NuclinoPage']; // NuclinoPage!
  }
  NuclinoUser: { // field return type
    email: string; // String!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
  }
  OpeningHour: { // field return type
    endTime: NexusGenScalars['DateTime']; // DateTime!
    startTime: NexusGenScalars['DateTime']; // DateTime!
  }
  Order: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    deposit: number; // Int!
    deviceId: string | null; // String
    id: number; // Int!
    items: NexusGenRootTypes['OrderItem'][]; // [OrderItem!]!
    payment: NexusGenEnums['OrderPayment']; // OrderPayment!
    total: number | null; // Int
  }
  OrderItem: { // field return type
    amount: number; // Int!
    id: number; // Int!
    name: string; // String!
    note: string | null; // String
    perUnitPrice: number; // Int!
    productList: NexusGenRootTypes['ProductList'] | null; // ProductList
  }
  Product: { // field return type
    id: number; // Int!
    name: string; // String!
    price: number; // Int!
    productListId: number; // Int!
    requiresDeposit: boolean; // Boolean!
    salesNumbers: NexusGenRootTypes['SalesNumber']; // SalesNumber!
  }
  ProductList: { // field return type
    active: boolean; // Boolean!
    emoji: string | null; // String
    historicalProducts: NexusGenRootTypes['HistoricalProduct'][]; // [HistoricalProduct!]!
    id: number; // Int!
    name: string; // String!
    product: NexusGenRootTypes['Product'][]; // [Product!]!
    salesNumbers: NexusGenRootTypes['SalesNumber']; // SalesNumber!
  }
  Query: { // field return type
    areas: NexusGenRootTypes['Area'][]; // [Area!]!
    availableCapacity: number; // Int!
    config: NexusGenRootTypes['Config'] | null; // Config
    devices: NexusGenRootTypes['Device'][]; // [Device!]!
    distanceToKult: number | null; // Float
    events: NexusGenRootTypes['Event'][]; // [Event!]!
    node: NexusGenRootTypes['Node'] | null; // Node
    nuclinoPage: NexusGenRootTypes['NuclinoPage'] | null; // NuclinoPage
    nuclinoPages: NexusGenRootTypes['NuclinoSearchResult'][]; // [NuclinoSearchResult!]!
    productList: NexusGenRootTypes['ProductList'] | null; // ProductList
    productLists: NexusGenRootTypes['ProductList'][]; // [ProductList!]!
    reservationForToken: NexusGenRootTypes['Reservation'] | null; // Reservation
    reservationsByPerson: NexusGenRootTypes['ReservationByPerson'][]; // [ReservationByPerson!]!
    viewer: NexusGenRootTypes['Viewer'] | null; // Viewer
  }
  Reservation: { // field return type
    alternativeTables: Array<NexusGenRootTypes['Table'] | null>; // [Table]!
    availableToCheckIn: number; // Int!
    checkInTime: NexusGenScalars['DateTime'] | null; // DateTime
    checkedInPersons: number; // Int!
    endTime: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    note: string | null; // String
    otherPersons: string[]; // [String!]!
    primaryEmail: string; // String!
    primaryPerson: string; // String!
    reservationsFromSamePerson: NexusGenRootTypes['Reservation'][]; // [Reservation!]!
    startTime: NexusGenScalars['DateTime']; // DateTime!
    status: NexusGenEnums['ReservationStatus']; // ReservationStatus!
    swappableWith: Array<NexusGenRootTypes['Reservation'] | null>; // [Reservation]!
    table: NexusGenRootTypes['Table']; // Table!
    tableId: string; // String!
    token: string; // String!
  }
  ReservationByPerson: { // field return type
    email: string; // String!
    reservations: NexusGenRootTypes['Reservation'][]; // [Reservation!]!
  }
  SalesNumber: { // field return type
    count: number; // Int!
    timeSeries: NexusGenRootTypes['TimeSeries'][]; // [TimeSeries!]!
    total: number; // Float!
  }
  Table: { // field return type
    area: NexusGenRootTypes['Area']; // Area!
    displayName: string; // String!
    id: string; // ID!
    maxCapacity: number; // Int!
    reservations: NexusGenRootTypes['Reservation'][]; // [Reservation!]!
    type: NexusGenEnums['TableType']; // TableType!
  }
  TableAvailability: { // field return type
    endTime: NexusGenScalars['DateTime']; // DateTime!
    startTime: NexusGenScalars['DateTime']; // DateTime!
    tableType: NexusGenEnums['TableType']; // TableType!
  }
  TimeSeries: { // field return type
    time: NexusGenScalars['DateTime']; // DateTime!
    value: number; // Int!
  }
  Viewer: { // field return type
    displayName: string; // String!
    email: string; // String!
    id: string; // ID!
    profilePicture: string | null; // String
  }
  Billable: { // field return type
    salesNumbers: NexusGenRootTypes['SalesNumber']; // SalesNumber!
  }
  Node: { // field return type
    id: string; // ID!
  }
}

export interface NexusGenFieldTypeNames {
  Area: { // field return type name
    availability: 'TableAvailability'
    availableTables: 'Int'
    bandsPlaying: 'Band'
    displayName: 'String'
    id: 'ID'
    openingHour: 'OpeningHour'
    table: 'Table'
    themeColor: 'String'
  }
  Band: { // field return type name
    description: 'String'
    endTime: 'DateTime'
    genre: 'String'
    id: 'ID'
    name: 'String'
    startTime: 'DateTime'
  }
  BandApplication: { // field return type name
    bandApplicationRating: 'BandApplicationRating'
    bandname: 'String'
    city: 'String'
    contactName: 'String'
    contactPhone: 'String'
    contactedByViewer: 'Viewer'
    demo: 'String'
    description: 'String'
    distance: 'Float'
    email: 'String'
    facebook: 'String'
    facebookLikes: 'Int'
    genre: 'String'
    genreCategory: 'GenreCategory'
    hasPreviouslyPlayed: 'PreviouslyPlayed'
    heardAboutBookingFrom: 'HeardAboutBookingFrom'
    id: 'ID'
    instagram: 'String'
    instagramFollower: 'Int'
    knowsKultFrom: 'String'
    numberOfArtists: 'Int'
    numberOfNonMaleArtists: 'Int'
    rating: 'Float'
    website: 'String'
  }
  BandApplicationRating: { // field return type name
    rating: 'Int'
    viewer: 'Viewer'
  }
  Board: { // field return type name
    chair: 'String'
    deputy: 'String'
    deputy2: 'String'
    observer: 'String'
    observer2: 'String'
    secretary: 'String'
    treasurer: 'String'
  }
  CardTransaction: { // field return type name
    pack: 'String'
    password: 'String'
    payload: 'String'
  }
  Config: { // field return type name
    board: 'Board'
    depositValue: 'Int'
    reservationStart: 'DateTime'
  }
  Device: { // field return type name
    id: 'ID'
    lastSeen: 'DateTime'
    productList: 'ProductList'
    salesNumbers: 'SalesNumber'
  }
  Event: { // field return type name
    bandApplication: 'BandApplication'
    bandApplicationEnd: 'DateTime'
    bandApplicationStart: 'DateTime'
    bandsPlaying: 'Band'
    end: 'DateTime'
    id: 'ID'
    name: 'String'
    start: 'DateTime'
  }
  HistoricalProduct: { // field return type name
    name: 'String'
    productListId: 'Int'
    salesNumbers: 'SalesNumber'
  }
  Mutation: { // field return type name
    cancelReservation: 'Boolean'
    cardTransaction: 'CardTransaction'
    checkInReservation: 'Reservation'
    confirmReservation: 'Reservation'
    createBandApplication: 'BandApplication'
    createOrder: 'Order'
    createReservation: 'Reservation'
    markBandApplicationContacted: 'BandApplication'
    rateBandApplication: 'BandApplication'
    requestReservation: 'Boolean'
    swapReservations: 'Boolean'
    updateReservation: 'Reservation'
    updateReservationOtherPersons: 'Reservation'
    upsertProductList: 'ProductList'
  }
  NuclinoPage: { // field return type name
    content: 'String'
    id: 'ID'
    lastUpdatedAt: 'DateTime'
    lastUpdatedUser: 'NuclinoUser'
    title: 'String'
  }
  NuclinoSearchResult: { // field return type name
    highlight: 'String'
    page: 'NuclinoPage'
  }
  NuclinoUser: { // field return type name
    email: 'String'
    firstName: 'String'
    id: 'ID'
    lastName: 'String'
  }
  OpeningHour: { // field return type name
    endTime: 'DateTime'
    startTime: 'DateTime'
  }
  Order: { // field return type name
    createdAt: 'DateTime'
    deposit: 'Int'
    deviceId: 'String'
    id: 'Int'
    items: 'OrderItem'
    payment: 'OrderPayment'
    total: 'Int'
  }
  OrderItem: { // field return type name
    amount: 'Int'
    id: 'Int'
    name: 'String'
    note: 'String'
    perUnitPrice: 'Int'
    productList: 'ProductList'
  }
  Product: { // field return type name
    id: 'Int'
    name: 'String'
    price: 'Int'
    productListId: 'Int'
    requiresDeposit: 'Boolean'
    salesNumbers: 'SalesNumber'
  }
  ProductList: { // field return type name
    active: 'Boolean'
    emoji: 'String'
    historicalProducts: 'HistoricalProduct'
    id: 'Int'
    name: 'String'
    product: 'Product'
    salesNumbers: 'SalesNumber'
  }
  Query: { // field return type name
    areas: 'Area'
    availableCapacity: 'Int'
    config: 'Config'
    devices: 'Device'
    distanceToKult: 'Float'
    events: 'Event'
    node: 'Node'
    nuclinoPage: 'NuclinoPage'
    nuclinoPages: 'NuclinoSearchResult'
    productList: 'ProductList'
    productLists: 'ProductList'
    reservationForToken: 'Reservation'
    reservationsByPerson: 'ReservationByPerson'
    viewer: 'Viewer'
  }
  Reservation: { // field return type name
    alternativeTables: 'Table'
    availableToCheckIn: 'Int'
    checkInTime: 'DateTime'
    checkedInPersons: 'Int'
    endTime: 'DateTime'
    id: 'Int'
    note: 'String'
    otherPersons: 'String'
    primaryEmail: 'String'
    primaryPerson: 'String'
    reservationsFromSamePerson: 'Reservation'
    startTime: 'DateTime'
    status: 'ReservationStatus'
    swappableWith: 'Reservation'
    table: 'Table'
    tableId: 'String'
    token: 'String'
  }
  ReservationByPerson: { // field return type name
    email: 'String'
    reservations: 'Reservation'
  }
  SalesNumber: { // field return type name
    count: 'Int'
    timeSeries: 'TimeSeries'
    total: 'Float'
  }
  Table: { // field return type name
    area: 'Area'
    displayName: 'String'
    id: 'ID'
    maxCapacity: 'Int'
    reservations: 'Reservation'
    type: 'TableType'
  }
  TableAvailability: { // field return type name
    endTime: 'DateTime'
    startTime: 'DateTime'
    tableType: 'TableType'
  }
  TimeSeries: { // field return type name
    time: 'DateTime'
    value: 'Int'
  }
  Viewer: { // field return type name
    displayName: 'String'
    email: 'String'
    id: 'ID'
    profilePicture: 'String'
  }
  Billable: { // field return type name
    salesNumbers: 'SalesNumber'
  }
  Node: { // field return type name
    id: 'ID'
  }
}

export interface NexusGenArgTypes {
  Area: {
    availability: { // args
      day: NexusGenScalars['Date']; // Date!
      partySize: number; // Int!
    }
    availableTables: { // args
      time?: NexusGenScalars['DateTime'] | null; // DateTime
    }
    bandsPlaying: { // args
      day: NexusGenScalars['Date']; // Date!
    }
    openingHour: { // args
      day?: NexusGenScalars['Date'] | null; // Date
    }
  }
  Device: {
    salesNumbers: { // args
      after: NexusGenScalars['DateTime']; // DateTime!
      before: NexusGenScalars['DateTime']; // DateTime!
    }
  }
  HistoricalProduct: {
    salesNumbers: { // args
      after: NexusGenScalars['DateTime']; // DateTime!
      before: NexusGenScalars['DateTime']; // DateTime!
    }
  }
  Mutation: {
    cancelReservation: { // args
      token: string; // String!
    }
    cardTransaction: { // args
      balanceAfter: number; // Int!
      cardUri: string; // String!
      depositAfter: number; // Int!
    }
    checkInReservation: { // args
      checkedInPersons: number; // Int!
      id: number; // Int!
    }
    confirmReservation: { // args
      token: string; // String!
    }
    createBandApplication: { // args
      data: NexusGenInputs['CreateBandApplicationInput']; // CreateBandApplicationInput!
    }
    createOrder: { // args
      deposit: number; // Int!
      deviceTime: NexusGenScalars['DateTime']; // DateTime!
      payment: NexusGenEnums['OrderPayment']; // OrderPayment!
      products: NexusGenInputs['OrderItemInput'][]; // [OrderItemInput!]!
    }
    createReservation: { // args
      endTime: NexusGenScalars['DateTime']; // DateTime!
      note?: string | null; // String
      otherPersons: string[]; // [String!]!
      primaryEmail: string; // String!
      primaryPerson: string; // String!
      startTime: NexusGenScalars['DateTime']; // DateTime!
      tableId: string; // ID!
    }
    markBandApplicationContacted: { // args
      bandApplicationId: string; // ID!
      contacted: boolean; // Boolean!
    }
    rateBandApplication: { // args
      bandApplicationId: string; // ID!
      rating?: number | null; // Int
    }
    requestReservation: { // args
      areaId: string; // ID!
      endTime: NexusGenScalars['DateTime']; // DateTime!
      otherPersons: string[]; // [String!]!
      primaryEmail: string; // String!
      primaryPerson: string; // String!
      startTime: NexusGenScalars['DateTime']; // DateTime!
      tableType?: NexusGenEnums['TableType'] | null; // TableType
    }
    swapReservations: { // args
      a: number; // Int!
      b: number; // Int!
    }
    updateReservation: { // args
      checkedInPersons?: number | null; // Int
      endTime?: NexusGenScalars['DateTime'] | null; // DateTime
      id: number; // Int!
      note?: string | null; // String
      primaryPerson?: string | null; // String
      startTime?: NexusGenScalars['DateTime'] | null; // DateTime
      tableId?: string | null; // ID
    }
    updateReservationOtherPersons: { // args
      otherPersons: string[]; // [String!]!
      token: string; // String!
    }
    upsertProductList: { // args
      active?: boolean | null; // Boolean
      emoji?: string | null; // String
      id?: number | null; // Int
      name?: string | null; // String
      products?: NexusGenInputs['ProductInput'][] | null; // [ProductInput!]
    }
  }
  Product: {
    salesNumbers: { // args
      after: NexusGenScalars['DateTime']; // DateTime!
      before: NexusGenScalars['DateTime']; // DateTime!
    }
  }
  ProductList: {
    salesNumbers: { // args
      after: NexusGenScalars['DateTime']; // DateTime!
      before: NexusGenScalars['DateTime']; // DateTime!
    }
  }
  Query: {
    availableCapacity: { // args
      time?: NexusGenScalars['DateTime'] | null; // DateTime
    }
    distanceToKult: { // args
      origin: string; // String!
    }
    node: { // args
      id: string; // ID!
    }
    nuclinoPage: { // args
      id: string; // ID!
    }
    nuclinoPages: { // args
      query: string; // String!
    }
    productList: { // args
      id: number; // Int!
    }
    reservationForToken: { // args
      token: string; // String!
    }
  }
  SalesNumber: {
    timeSeries: { // args
      grouping?: NexusGenEnums['TimeGrouping'] | null; // TimeGrouping
    }
  }
  Table: {
    reservations: { // args
      day?: NexusGenScalars['Date'] | null; // Date
    }
  }
  Billable: {
    salesNumbers: { // args
      after: NexusGenScalars['DateTime']; // DateTime!
      before: NexusGenScalars['DateTime']; // DateTime!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
  Billable: "Device" | "HistoricalProduct" | "Product" | "ProductList"
  Node: "Area" | "BandApplication" | "Event" | "Table" | "Viewer"
}

export interface NexusGenTypeInterfaces {
  Area: "Node"
  BandApplication: "Node"
  Device: "Billable"
  Event: "Node"
  HistoricalProduct: "Billable"
  Product: "Billable"
  ProductList: "Billable"
  Table: "Node"
  Viewer: "Node"
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = keyof NexusGenInterfaces;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = "Billable" | "Node";

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: ctx;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}