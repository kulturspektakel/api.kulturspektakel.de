import env from 'env-var';

const ci = env.get('CI').asBool();

const e = {
  NODE_ENV: env
    .get('NODE_ENV')
    .required(!ci)
    .asEnum(['development', 'production', 'test']),
  PORT: env.get('PORT').required(!ci).asIntPositive(),
  DATABASE_URL: env.get('DATABASE_URL').required(!ci).asString(),
  JWT_SECRET: env.get('JWT_SECRET').required(!ci).asString(),
  SENDGRID_API_KEY: env.get('SENDGRID_API_KEY').required(!ci).asString(),
  SLACK_CLIENT_ID: env.get('SLACK_CLIENT_ID').required(!ci).asString(),
  SLACK_CLIENT_SECRET: env.get('SLACK_CLIENT_SECRET').required(!ci).asString(),
};

export default e;
