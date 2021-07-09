import {Context} from '../context';
import {TokenInput} from '../routes/auth';

const authProp = (...authTypes: TokenInput['type'][]) => (
  _root: unknown,
  _args: unknown,
  {token}: Context,
) => {
  for (const authType of authTypes) {
    switch (authType) {
      case 'user':
        if (token?.type === 'user' && Boolean(token.userId)) {
          return true;
        }
      case 'device':
        if (token?.type === 'device' && Boolean(token.deviceId)) {
          return true;
        }
    }
  }

  return false;
};

export default authProp;
