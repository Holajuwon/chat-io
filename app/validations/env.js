/* eslint-disable max-len */
import Joi from 'joi';
import config from '../config';

let envVariables = {};
const developDatabaseValidation = {
  INBEV_DATABASE_URL: Joi.string()
    .description('INBEV database url')
    .required(),
};

switch (config.NODE_ENV) {
  case 'test':
    envVariables = {
      INBEV_DATABASE_TEST_URL: Joi.string()
        .description('INBEV database url')
        .required(),
    };
    break;
  case 'production':
    envVariables = developDatabaseValidation;
    break;
  default:
    envVariables = developDatabaseValidation;
    break;
}

const envValidator = () => {
  const schema = Joi.object()
    .keys({
      ...envVariables,
      INBEV_NODE_ENV: Joi.string()
        .valid('production', 'development', 'test'),
      INBEV_PORT: Joi.number().default(3500),
    })
    .unknown();
  const result = schema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);
  return result;
};

export default envValidator;
