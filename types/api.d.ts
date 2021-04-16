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
  OrderItem: { // input type
    amount: number; // Int!
    note?: string | null; // String
    productId: number; // Int!
  }
  ProductListProductOrderByInput: { // input type
    order?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
  ProductProductListIdOrderCompoundUniqueInput: { // input type
    order: number; // Int!
    productListId: number; // Int!
  }
  ProductWhereUniqueInput: { // input type
    id?: number | null; // Int
    productListId_order?: NexusGenInputs['ProductProductListIdOrderCompoundUniqueInput'] | null; // ProductProductListIdOrderCompoundUniqueInput
  }
  TableAreaIdDisplayNameCompoundUniqueInput: { // input type
    areaId: string; // String!
    displayName: string; // String!
  }
  TableWhereUniqueInput: { // input type
    areaId_displayName?: NexusGenInputs['TableAreaIdDisplayNameCompoundUniqueInput'] | null; // TableAreaIdDisplayNameCompoundUniqueInput
    id?: string | null; // String
  }
}

export interface NexusGenEnums {
  OrderPayment: "BON" | "CASH" | "FREE_BAND" | "FREE_CREW" | "SUM_UP" | "VOUCHER"
  ReservationStatus: "CheckedIn" | "Cleared" | "Confirmed" | "Pending"
  SortOrder: "asc" | "desc"
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
  }
  Availability: { // root type
    endTime: NexusGenScalars['DateTime']; // DateTime!
    startTime: NexusGenScalars['DateTime']; // DateTime!
  }
  Band: { // root type
    endTime: NexusGenScalars['DateTime']; // DateTime!
    genre?: string | null; // String
    id: number; // Int!
    name: string; // String!
    startTime: NexusGenScalars['DateTime']; // DateTime!
  }
  Mutation: {};
  Order: { // root type
    id: number; // Int!
    payment: NexusGenEnums['OrderPayment']; // OrderPayment!
    tokens: number; // Int!
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
    endTime: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    startTime: NexusGenScalars['DateTime']; // DateTime!
    status: NexusGenEnums['ReservationStatus']; // ReservationStatus!
    token: string; // String!
  }
  Table: { // root type
    displayName: string; // String!
    id: string; // String!
    maxCapacity: number; // Int!
  }
  Viewer: { // root type
    displayName: string; // String!
    email: string; // String!
    profilePicture?: string | null; // String
  }
}

export interface NexusGenInterfaces {
  Node: NexusGenRootTypes['Area'];
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenInterfaces & NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Area: { // field return type
    availability: NexusGenRootTypes['Availability'][]; // [Availability!]!
    bandsPlaying: NexusGenRootTypes['Band'][]; // [Band!]!
    displayName: string; // String!
    id: string; // ID!
    openingHour: NexusGenRootTypes['Availability'][]; // [Availability!]!
    table: NexusGenRootTypes['Table'][]; // [Table!]!
  }
  Availability: { // field return type
    endTime: NexusGenScalars['DateTime']; // DateTime!
    startTime: NexusGenScalars['DateTime']; // DateTime!
  }
  Band: { // field return type
    endTime: NexusGenScalars['DateTime']; // DateTime!
    genre: string | null; // String
    id: number; // Int!
    name: string; // String!
    startTime: NexusGenScalars['DateTime']; // DateTime!
  }
  Mutation: { // field return type
    cancelReservation: boolean | null; // Boolean
    confirmReservation: NexusGenRootTypes['Reservation'] | null; // Reservation
    createOrder: NexusGenRootTypes['Order'] | null; // Order
    requestReservation: boolean; // Boolean!
    updateReservation: NexusGenRootTypes['Reservation'] | null; // Reservation
  }
  Order: { // field return type
    id: number; // Int!
    payment: NexusGenEnums['OrderPayment']; // OrderPayment!
    tokens: number; // Int!
    total: number | null; // Int
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
    node: NexusGenRootTypes['Node'] | null; // Node
    productLists: NexusGenRootTypes['ProductList'][]; // [ProductList!]!
    reservationForToken: NexusGenRootTypes['Reservation'] | null; // Reservation
    viewer: NexusGenRootTypes['Viewer'] | null; // Viewer
  }
  Reservation: { // field return type
    endTime: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    reservationsFromSamePerson: NexusGenRootTypes['Reservation'][]; // [Reservation!]!
    startTime: NexusGenScalars['DateTime']; // DateTime!
    status: NexusGenEnums['ReservationStatus']; // ReservationStatus!
    table: NexusGenRootTypes['Table']; // Table!
    token: string; // String!
  }
  Table: { // field return type
    area: NexusGenRootTypes['Area']; // Area!
    displayName: string; // String!
    id: string; // String!
    maxCapacity: number; // Int!
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
    availability: 'Availability'
    bandsPlaying: 'Band'
    displayName: 'String'
    id: 'ID'
    openingHour: 'Availability'
    table: 'Table'
  }
  Availability: { // field return type name
    endTime: 'DateTime'
    startTime: 'DateTime'
  }
  Band: { // field return type name
    endTime: 'DateTime'
    genre: 'String'
    id: 'Int'
    name: 'String'
    startTime: 'DateTime'
  }
  Mutation: { // field return type name
    cancelReservation: 'Boolean'
    confirmReservation: 'Reservation'
    createOrder: 'Order'
    requestReservation: 'Boolean'
    updateReservation: 'Reservation'
  }
  Order: { // field return type name
    id: 'Int'
    payment: 'OrderPayment'
    tokens: 'Int'
    total: 'Int'
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
    node: 'Node'
    productLists: 'ProductList'
    reservationForToken: 'Reservation'
    viewer: 'Viewer'
  }
  Reservation: { // field return type name
    endTime: 'DateTime'
    id: 'Int'
    reservationsFromSamePerson: 'Reservation'
    startTime: 'DateTime'
    status: 'ReservationStatus'
    table: 'Table'
    token: 'String'
  }
  Table: { // field return type name
    area: 'Area'
    displayName: 'String'
    id: 'String'
    maxCapacity: 'Int'
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
    bandsPlaying: { // args
      day: NexusGenScalars['Date']; // Date!
    }
    openingHour: { // args
      day?: NexusGenScalars['Date'] | null; // Date
    }
    table: { // args
      after?: NexusGenInputs['TableWhereUniqueInput'] | null; // TableWhereUniqueInput
      before?: NexusGenInputs['TableWhereUniqueInput'] | null; // TableWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
    }
  }
  Mutation: {
    cancelReservation: { // args
      token: string; // String!
    }
    confirmReservation: { // args
      token: string; // String!
    }
    createOrder: { // args
      payment: NexusGenEnums['OrderPayment']; // OrderPayment!
      products: NexusGenInputs['OrderItem'][]; // [OrderItem!]!
      tableId: string; // ID!
    }
    requestReservation: { // args
      areaId: string; // ID!
      endTime: NexusGenScalars['DateTime']; // DateTime!
      otherPersons: string[]; // [String!]!
      primaryEmail: string; // String!
      primaryPerson: string; // String!
      startTime: NexusGenScalars['DateTime']; // DateTime!
    }
    updateReservation: { // args
      otherPersons: string[]; // [String!]!
      primaryEmail: string; // String!
      primaryPerson: string; // String!
      token: string; // String!
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
    node: { // args
      id: string; // ID!
    }
    reservationForToken: { // args
      token: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
  Node: "Area"
}

export interface NexusGenTypeInterfaces {
  Area: "Node"
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