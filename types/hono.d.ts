import {ParsedToken} from '../src/routes/auth';

declare module 'hono' {
  interface ContextVariableMap {
    parsedToken?: ParsedToken;
  }
}
