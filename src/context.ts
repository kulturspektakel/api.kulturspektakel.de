import {PrismaClient} from '@prisma/client';
import prismaClient from './utils/prismaClient';
import {ContextFunction} from 'apollo-server-core';
import {ParsedToken} from './routes/auth';
import {Request} from 'express';

export type Context = {
  prismaClient: PrismaClient;
  token?: string;
} & Partial<ParsedToken>;

const context: ContextFunction<{
  req: Request & {
    _token?: ParsedToken;
  };
}> = ({req}): Context => ({prismaClient, userId: req._token?.userId});

export default context;
