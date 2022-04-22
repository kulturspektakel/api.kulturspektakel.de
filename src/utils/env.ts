import env from 'env-var';

export default {
  NODE_ENV: env
    .get('NODE_ENV')
    .required()
    .asEnum(['development', 'production', 'test']),
  PORT: env.get('PORT').required().asIntPositive(),
  DATABASE_URL: env.get('DATABASE_URL').required().asString(),
  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
  SLACK_CLIENT_ID: env.get('SLACK_CLIENT_ID').required().asString(),
  SLACK_CLIENT_SECRET: env.get('SLACK_CLIENT_SECRET').required().asString(),
  SLACK_TEAM_ID: env.get('SLACK_TEAM_ID').required().asString(),
  PASSKIT_KEY: env.get('PASSKIT_KEY').required().asString(),
  AWS_ACCESS_KEY_ID: env.get('AWS_ACCESS_KEY_ID').required().asString(),
  AWS_SECRET_ACCESS_KEY: env.get('AWS_SECRET_ACCESS_KEY').required().asString(),
  KULT_WEBSITE_API_PASSWORD: env
    .get('KULT_WEBSITE_API_PASSWORD')
    .required()
    .asString(),
  KULT_WEBSITE_API_EMAIL: env
    .get('KULT_WEBSITE_API_EMAIL')
    .required()
    .asString(),
  SLACK_BOT_TOKEN: env.get('SLACK_BOT_TOKEN').required().asString(),
  KULT_CASH_SALT: env.get('KULT_CASH_SALT').required().asString(),
  BING_MAPS_KEY: env.get('BING_MAPS_KEY').required().asString(),
  NUCLINO_WORKSPACE_ID: env.get('NUCLINO_WORKSPACE_ID').required().asString(),
  NUCLINO_TEAM_ID: env.get('NUCLINO_TEAM_ID').required().asString(),
  NUCLINO_API_KEY: env.get('NUCLINO_API_KEY').required().asString(),
  NUCLINO_ANONYMOUS_PASSWORD: env
    .get('NUCLINO_ANONYMOUS_PASSWORD')
    .required()
    .asString(),
  GOOGLE_APPLICATION_CREDENTIALS: env
    .get('GOOGLE_APPLICATION_CREDENTIALS')
    .required()
    .asString(),
  SAML_CERT: env.get('SAML_CERT').required().asString(),
  SAML_PRIVATE_KEY: env.get('SAML_PRIVATE_KEY').required().asString(),
};
