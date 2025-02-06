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
  GITHUB_CLIENT_ID: Joi.string().required(),
  GITHUB_CLIENT_SECRET: Joi.string().required(),
  GITHUB_CALLBACK_URL: Joi.string().required(),
  FRONTEND_GITHUB_AUTH_PAGE: Joi.string().required(),
  MONGO_CONNECTION: Joi.string()
    .uri({ scheme: ['mongodb', 'mongodb+srv'] })
    .optional(),
};
export const serviceSchema = Joi.object(schema);
export type ConfigVariables = typeof schema;
