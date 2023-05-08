import Joi from 'joi';
import BaseSchemaValidator from '../../validations';
import constants from '../../utils/constants';

const { passwordRegex, INVALID_PASSWORD } = constants;

export default class AuthValidator {
  static async login(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email().label('Email').required(),
      password: Joi.string().trim().label('Password').required(),
    });
    BaseSchemaValidator.baseValidator(schema, req, res, next, 'body');
  }

  static async validateRegister(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email().label('Email').required(),
      password: Joi.string().trim().label('Password').regex(passwordRegex)
        .message(INVALID_PASSWORD),
      username: Joi.string().min(3).trim().label('Username')
        .required(),
    });
    BaseSchemaValidator.baseValidator(schema, req, res, next, 'body');
  }
}
