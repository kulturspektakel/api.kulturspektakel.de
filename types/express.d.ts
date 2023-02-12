import {ParsedToken} from '../src/routes/auth';

declare global {
  namespace Express {
    interface Request {
      _parsedToken?: ParsedToken;
    }
  }
}
