import {PrismaClient} from '@prisma/client';
import prismaClient from './utils/prismaClient';
import {ContextFunction} from 'apollo-server-core';
import {ParsedToken} from './routes/auth';
import {Request} from 'express';

export type Context = {
  prismaClient: PrismaClient;
  token?: Partial<ParsedToken>;
};

const context: ContextFunction<{
  req: Request & {
    _token?: ParsedToken;
    _deviceId?: string;
  };
}> = ({req}): Context => ({
  prismaClient,
  token: req._token,
});
export default context;
