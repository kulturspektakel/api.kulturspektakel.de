import {ContextFunction} from 'apollo-server-core';
import {ParsedToken} from './routes/auth';
import {Request} from 'express';

export type Context = {
  parsedToken?: ParsedToken;
};

const context: ContextFunction<{
  req: Request;
}> = ({req}): Context => ({
  parsedToken: req._parsedToken,
});
export default context;
