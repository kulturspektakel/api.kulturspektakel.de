/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import { Context as ctx } from "./../src/context"
import { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import { core } from "nexus"
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
  interface NexusGenCustomOutputProperties<TypeName extends string> {
    model: NexusPrisma<TypeName, 'model'>
    crud: any
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  OrderItemInput: { // input type
    amount: number; // Int!
    note?: string | null; // String
    productId: number; // Int!
  }
  ProductInput: { // input type
    name: string; // String!
    price: number; // Int!
  }
  ProductListProductOrderByInput: { // input type
    order?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  ProductWhereUniqueInput: { // input type
    id?: number | null; // Int
  }
}

export interface NexusGenEnums {
  OrderPayment: "BON" | "CASH" | "FREE_BAND" | "FREE_CREW" | "SUM_UP" | "VOUCHER"
  ReservationStatus: "CheckedIn" | "Confirmed" | "Pending"
  SortOrder: "asc" | "desc"
  TableType: "ISLAND" | "TABLE"
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
  Config: { // root type
    reservationStart?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Mutation: {};
  OpeningHour: { // root type
    endTime: NexusGenScalars['DateTime']; // DateTime!
    startTime: NexusGenScalars['DateTime']; // DateTime!
  }
  Order: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    payment: NexusGenEnums['OrderPayment']; // OrderPayment!
    tokens: number; // Int!
  }
  OrderItem: { // root type
    amount: number; // Int!
    id: number; // Int!
    name: string; // String!
    note?: string | null; // String
  }
  Product: { // root type
    id: number; // Int!
    name: string; // String!
    price: number; // Int!
  }
  ProductList: { // root type
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
    primaryPerson: string; // String!
    startTime: NexusGenScalars['DateTime']; // DateTime!
    status: NexusGenEnums['ReservationStatus']; // ReservationStatus!
    token: string; // String!
  }
  ReservationByPerson: { // root type
    email: string; // String!
    reservations: NexusGenRootTypes['Reservation'][]; // [Reservation!]!
  }
  Table: { // root type
    displayName: string; // String!
    maxCapacity: number; // Int!
    type: NexusGenEnums['TableType']; // TableType!
  }
  TableAvailability: { // root type
    endTime: NexusGenScalars['DateTime']; // DateTime!
    startTime: NexusGenScalars['DateTime']; // DateTime!
    tableType: NexusGenEnums['TableType']; // TableType!
  }
  Viewer: { // root type
    displayName: string; // String!
    email: string; // String!
    profilePicture?: string | null; // String
  }
}

export interface NexusGenInterfaces {
  Node: NexusGenRootTypes['Area'] | NexusGenRootTypes['Table'];
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
  Config: { // field return type
    reservationStart: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Mutation: { // field return type
    cancelReservation: boolean | null; // Boolean
    checkInReservation: NexusGenRootTypes['Reservation'] | null; // Reservation
    confirmReservation: NexusGenRootTypes['Reservation'] | null; // Reservation
    createOrder: NexusGenRootTypes['Order'] | null; // Order
    createReservation: NexusGenRootTypes['Reservation'] | null; // Reservation
    deleteProductList: boolean | null; // Boolean
    requestReservation: boolean; // Boolean!
    updateReservation: NexusGenRootTypes['Reservation'] | null; // Reservation
    updateReservationOtherPersons: NexusGenRootTypes['Reservation'] | null; // Reservation
    upsertProductList: NexusGenRootTypes['ProductList'] | null; // ProductList
  }
  OpeningHour: { // field return type
    endTime: NexusGenScalars['DateTime']; // DateTime!
    startTime: NexusGenScalars['DateTime']; // DateTime!
  }
  Order: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    items: NexusGenRootTypes['OrderItem'][]; // [OrderItem!]!
    payment: NexusGenEnums['OrderPayment']; // OrderPayment!
    tokens: number; // Int!
    total: number | null; // Int
  }
  OrderItem: { // field return type
    amount: number; // Int!
    id: number; // Int!
    name: string; // String!
    note: string | null; // String
  }
  Product: { // field return type
    id: number; // Int!
    name: string; // String!
    price: number; // Int!
  }
  ProductList: { // field return type
    emoji: string | null; // String
    id: number; // Int!
    name: string; // String!
    product: NexusGenRootTypes['Product'][]; // [Product!]!
  }
  Query: { // field return type
    areas: NexusGenRootTypes['Area'][]; // [Area!]!
    availableCapacity: number; // Int!
    config: NexusGenRootTypes['Config'] | null; // Config
    node: NexusGenRootTypes['Node'] | null; // Node
    orderItems: NexusGenRootTypes['OrderItem'][]; // [OrderItem!]!
    orders: NexusGenRootTypes['Order'][]; // [Order!]!
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
    primaryPerson: string; // String!
    reservationsFromSamePerson: NexusGenRootTypes['Reservation'][]; // [Reservation!]!
    startTime: NexusGenScalars['DateTime']; // DateTime!
    status: NexusGenEnums['ReservationStatus']; // ReservationStatus!
    table: NexusGenRootTypes['Table']; // Table!
    token: string; // String!
  }
  ReservationByPerson: { // field return type
    email: string; // String!
    reservations: NexusGenRootTypes['Reservation'][]; // [Reservation!]!
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
  Viewer: { // field return type
    displayName: string; // String!
    email: string; // String!
    profilePicture: string | null; // String
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
  Config: { // field return type name
    reservationStart: 'DateTime'
  }
  Mutation: { // field return type name
    cancelReservation: 'Boolean'
    checkInReservation: 'Reservation'
    confirmReservation: 'Reservation'
    createOrder: 'Order'
    createReservation: 'Reservation'
    deleteProductList: 'Boolean'
    requestReservation: 'Boolean'
    updateReservation: 'Reservation'
    updateReservationOtherPersons: 'Reservation'
    upsertProductList: 'ProductList'
  }
  OpeningHour: { // field return type name
    endTime: 'DateTime'
    startTime: 'DateTime'
  }
  Order: { // field return type name
    createdAt: 'DateTime'
    id: 'Int'
    items: 'OrderItem'
    payment: 'OrderPayment'
    tokens: 'Int'
    total: 'Int'
  }
  OrderItem: { // field return type name
    amount: 'Int'
    id: 'Int'
    name: 'String'
    note: 'String'
  }
  Product: { // field return type name
    id: 'Int'
    name: 'String'
    price: 'Int'
  }
  ProductList: { // field return type name
    emoji: 'String'
    id: 'Int'
    name: 'String'
    product: 'Product'
  }
  Query: { // field return type name
    areas: 'Area'
    availableCapacity: 'Int'
    config: 'Config'
    node: 'Node'
    orderItems: 'OrderItem'
    orders: 'Order'
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
    primaryPerson: 'String'
    reservationsFromSamePerson: 'Reservation'
    startTime: 'DateTime'
    status: 'ReservationStatus'
    table: 'Table'
    token: 'String'
  }
  ReservationByPerson: { // field return type name
    email: 'String'
    reservations: 'Reservation'
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
  Viewer: { // field return type name
    displayName: 'String'
    email: 'String'
    profilePicture: 'String'
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
  Mutation: {
    cancelReservation: { // args
      token: string; // String!
    }
    checkInReservation: { // args
      checkedInPersons: number; // Int!
      id: number; // Int!
    }
    confirmReservation: { // args
      token: string; // String!
    }
    createOrder: { // args
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
    deleteProductList: { // args
      id: number; // Int!
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
    updateReservation: { // args
      checkedInPersons?: number | null; // Int
      endTime?: NexusGenScalars['DateTime'] | null; // DateTime
      id: number; // Int!
      note?: string | null; // String
      startTime?: NexusGenScalars['DateTime'] | null; // DateTime
      tableId?: string | null; // ID
    }
    updateReservationOtherPersons: { // args
      otherPersons: string[]; // [String!]!
      token: string; // String!
    }
    upsertProductList: { // args
      emoji?: string | null; // String
      id?: number | null; // Int
      name?: string | null; // String
      products?: NexusGenInputs['ProductInput'][] | null; // [ProductInput!]
    }
  }
  ProductList: {
    product: { // args
      after?: NexusGenInputs['ProductWhereUniqueInput'] | null; // ProductWhereUniqueInput
      before?: NexusGenInputs['ProductWhereUniqueInput'] | null; // ProductWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      orderBy?: NexusGenInputs['ProductListProductOrderByInput'][] | null; // [ProductListProductOrderByInput!]
    }
  }
  Query: {
    availableCapacity: { // args
      time?: NexusGenScalars['DateTime'] | null; // DateTime
    }
    node: { // args
      id: string; // ID!
    }
    orderItems: { // args
      from?: NexusGenScalars['DateTime'] | null; // DateTime
      productListId?: number | null; // Int
      until?: NexusGenScalars['DateTime'] | null; // DateTime
    }
    reservationForToken: { // args
      token: string; // String!
    }
  }
  Table: {
    reservations: { // args
      day?: NexusGenScalars['Date'] | null; // Date
    }
  }
}

export interface NexusGenAbstractTypeMembers {
  Node: "Area" | "Table"
}

export interface NexusGenTypeInterfaces {
  Area: "Node"
  Table: "Node"
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = keyof NexusGenInterfaces;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = "Node";

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