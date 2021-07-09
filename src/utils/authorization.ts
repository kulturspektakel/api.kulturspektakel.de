import {Context} from '../context';
import {TokenInput} from '../routes/auth';
import UnreachableCaseError from './UnreachableCaseError';

const authProp = (authType: TokenInput['type']) => (
  _root: unknown,
  _args: unknown,
  {token}: Context,
) => {
  switch (authType) {
    case 'user':
      return token?.type === 'user' && Boolean(token.userId);
    case 'device':
      return token?.type === 'device' && Boolean(token.deviceId);
    default:
      throw new UnreachableCaseError(authType);
  }
};

export default authProp;
