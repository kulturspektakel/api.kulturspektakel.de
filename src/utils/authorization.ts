import {Context} from '../context';

const authProp =
  (...authTypes: ('user' | 'device')[]) =>
  (_root: unknown, _args: unknown, {parsedToken}: Context) => {
    for (const authType of authTypes) {
      switch (authType) {
        case 'user':
          if (parsedToken?.iss === 'directus') {
            return true;
          }
        case 'device':
          if (parsedToken?.iss === 'device') {
            return true;
          }
      }
    }

    return false;
  };

export default authProp;
