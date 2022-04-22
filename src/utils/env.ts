import env from 'env-var';

export default {
  NODE_ENV: env.get('NODE_ENV').asEnum(['development', 'production', 'test']),
  PORT: env.get('PORT').asIntPositive(),
  DATABASE_URL: env.get('DATABASE_URL').asString(),
  JWT_SECRET: env.get('JWT_SECRET').asString(),
  SLACK_CLIENT_ID: env.get('SLACK_CLIENT_ID').asString(),
  SLACK_CLIENT_SECRET: env.get('SLACK_CLIENT_SECRET').asString(),
  SLACK_TEAM_ID: env.get('SLACK_TEAM_ID').asString(),
  PASSKIT_KEY: env.get('PASSKIT_KEY').asString(),
  AWS_ACCESS_KEY_ID: env.get('AWS_ACCESS_KEY_ID').asString(),
  AWS_SECRET_ACCESS_KEY: env.get('AWS_SECRET_ACCESS_KEY').asString(),
  KULT_WEBSITE_API_PASSWORD: env.get('KULT_WEBSITE_API_PASSWORD').asString(),
  KULT_WEBSITE_API_EMAIL: env.get('KULT_WEBSITE_API_EMAIL').asString(),
  SLACK_BOT_TOKEN: env.get('SLACK_BOT_TOKEN').asString(),
  KULT_CASH_SALT: env.get('KULT_CASH_SALT').asString(),
  BING_MAPS_KEY: env.get('BING_MAPS_KEY').asString(),
  NUCLINO_WORKSPACE_ID: env.get('NUCLINO_WORKSPACE_ID').asString(),
  NUCLINO_TEAM_ID: env.get('NUCLINO_TEAM_ID').asString(),
  NUCLINO_API_KEY: env.get('NUCLINO_API_KEY').asString(),
  NUCLINO_ANONYMOUS_PASSWORD: env.get('NUCLINO_ANONYMOUS_PASSWORD').asString(),
  GOOGLE_APPLICATION_CREDENTIALS: env
    .get('GOOGLE_APPLICATION_CREDENTIALS')
    .asString(),
  SAML_CERT: env.get('SAML_CERT').asString(),
  SAML_PRIVATE_KEY: env.get('SAML_PRIVATE_KEY').asString(),
};
