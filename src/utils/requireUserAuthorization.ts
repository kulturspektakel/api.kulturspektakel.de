import {FieldAuthorizeResolver} from 'nexus/dist/plugins/fieldAuthorizePlugin';

type AuthProp = {
  authorize: FieldAuthorizeResolver<any, any>;
};

const authProp: AuthProp = {
  authorize: (_, __, {token}) =>
    token?.type === 'user' && Boolean(token.userId),
};

export default authProp;
