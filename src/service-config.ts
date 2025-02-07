import * as Joi from 'joi';

const schema = {
  MODE: Joi.string().valid('dev', 'prod'),
  PORT: Joi.number().min(3000).max(9000),
  DB_CONNECTION: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  JWT_SECRET: Joi.string().required(),
  COOKIE_SECRET: Joi.string().required(),
  GITHUB_CLIENT_ID: Joi.string().required(),
  GITHUB_CLIENT_SECRET: Joi.string().required(),
  GITHUB_CALLBACK_URL: Joi.string().required(),
  FRONTEND_GITHUB_AUTH_PAGE: Joi.string().required(),
  LOG_LEVEL: Joi.string().valid('trace', 'debug', 'info', 'warn', 'error'),
  GITHUB_PAT_TOKEN: Joi.string().required(),
  GITHUB_REPO_OWNER: Joi.string().required(),
  GITHUB_REPO_NAME: Joi.string().required(),
  GITHUB_NAVIGATION: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().required(),
  MONGO_CONNECTION: Joi.string()
    .uri({ scheme: ['mongodb', 'mongodb+srv'] })
    .optional(),
};
export const serviceSchema = Joi.object(schema);
export type ConfigVariables = typeof schema;
