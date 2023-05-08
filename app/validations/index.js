/* eslint-disable no-multi-assign */
import { ApiError, Helper } from '../utils';

const { moduleErrLogMessager, errorResponse } = Helper;

class BaseSchemaValidator {
  static async dynamicValidator(schema, req, type) {
    let data;
    switch (type) {
      case ('body'):
        data = req.body = await schema.validateAsync(req.body);
        break;
      case ('query'):
        data = req.query = await schema.validateAsync(req.query);
        break;
      default:
        data = req.params = await schema.validateAsync(req.params);
        break;
    }
    return data;
  }

  static async baseValidator(schema, req, res, next, type) {
    try {
      await BaseSchemaValidator.dynamicValidator(schema, req, type);
      return next();
    } catch (err) {
      const APIError = new ApiError({
        message: err.message.replace(/["]/gi, ''),
        status: 400,
        err,
      });
      moduleErrLogMessager(APIError);
      return errorResponse(req, res, {
        message: err.message.replace(/["]/gi, ''),
        status: 400,
        err,
      });
    }
  }
}
export default BaseSchemaValidator;
