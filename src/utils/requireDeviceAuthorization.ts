import {FieldAuthorizeResolver} from 'nexus/dist/plugins/fieldAuthorizePlugin';

type AuthProp = {
  authorize: FieldAuthorizeResolver<any, any>;
};

const authProp: AuthProp = {
  authorize: (_, __, {token}) =>
    token?.type === 'device' && Boolean(token.deviceId),
};

export default authProp;
