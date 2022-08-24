import {ContextFunction} from 'apollo-server-core';
import {ParsedToken} from './routes/auth';
import {Request} from 'express';

export type Context = {
  token?: Partial<ParsedToken>;
};

const context: ContextFunction<{
  req: Request & {
    _token?: ParsedToken;
    _deviceId?: string;
  };
}> = ({req}): Context => ({
  token: req._token,
});
export default context;
