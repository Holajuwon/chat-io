/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */

import {
  Helper,
  ErrorFactory,
  DBError,
  constants,
} from '../../utils/index';
import Service from '../service/auth.service';

const { successResponse, moduleErrLogMessager } = Helper;
const {
  AUTH_SUCCESS, AUTH_FAILED, RESOURCE_CREATE_SUCCESS,
  RESOURCE_CREATE_ERROR,
} = constants;

class AuthController {
  async login(req, res, next) {
    try {
      const data = Service.login(req.decoded);
      return successResponse(res, { message: AUTH_SUCCESS, code: 200, data });
    } catch (e) {
      const error = ErrorFactory.resolveError(e);
      const dbError = new DBError({
        status: AUTH_FAILED,
        message: e.message,
      });
      moduleErrLogMessager(dbError);
      return next(error);
    }
  }

  async signup(req, res, next) {
    try {
      await Service.userSignup(req.body);
      return successResponse(res, {
        message: RESOURCE_CREATE_SUCCESS('User profile'),
        code: 201
      });
    } catch (e) {
      const error = ErrorFactory.resolveError(e);
      const dbError = new DBError({
        status: RESOURCE_CREATE_ERROR('User profile'),
        message: e.message,
      });
      moduleErrLogMessager(dbError);
      return next(error);
    }
  }
}

export default new AuthController();
