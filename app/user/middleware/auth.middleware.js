/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import {
  Helper, DBError, constants, ApiError,
} from '../../utils';
import AuthService from '../service/auth.service';

const {
  moduleErrLogMessager, compareHash, errorResponse,
  verifyToken,
} = Helper;
const {
  AUTH_FAILED, INVALID_CREDENTIALS, AUTH_REQUIRED, RESOURCE_ALREADY_EXIST,
  INVALID_TOKEN, RESOURCE_FETCH_ERROR_STATUS
} = constants;

export default class AuthMiddleware {
  static async checkIfUserEmailExist(req, res, next) {
    try {
      const { email } = req.body;
      const user = await AuthService.getUserByEmail(email);
      if (user) {
        throw new ApiError({
          message: RESOURCE_ALREADY_EXIST('An account with this email'),
          status: 409,
        });
      }
      return next();
    } catch (err) {
      const dbError = new DBError({
        status: RESOURCE_FETCH_ERROR_STATUS('checkIfUserEmailExist'),
        message: err.message,
      });
      moduleErrLogMessager(dbError);
      return next(err);
    }
  }

  static async validateUser(req, res, next) {
    try {
      const user = await AuthService.getUserByEmail(req.body.email);
      if (user) {
        req.decoded = user;
        return next();
      }
      throw new ApiError({
        message: INVALID_CREDENTIALS,
        status: 400,
      });
    } catch (err) {
      const dbError = new DBError({
        status: AUTH_FAILED,
        message: err.message,
      });
      moduleErrLogMessager(dbError);
      return next(err);
    }
  }

  static comparePassword(req, res, next) {
    try {
      const { decoded } = req;
      const { password } = req.body;
      if (!compareHash(password, decoded.hashed_password)) {
        throw new ApiError({
          message: INVALID_CREDENTIALS,
          status: 400,
        });
      }
      delete decoded.hashed_password;
      return next();
    } catch (err) {
      const dbError = new DBError({
        status: AUTH_FAILED,
        message: err.message,
      });
      moduleErrLogMessager(dbError);
      return next(err);
    }
  }

  static async verifyAuth(req, res, next) {
    try {
      const bearerToken = req.header('Authorization');
      if (!bearerToken) {
        return errorResponse(req, res, {
          message: AUTH_REQUIRED,
          status: 401,
        });
      }
      const decoded = verifyToken(bearerToken);
      if (decoded.message) {
        return errorResponse(req, res, {
          message: decoded.message,
          status: 401,
        });
      }
      req.decoded = decoded;
      req.decoded.token = bearerToken;
      const [user] = await AuthService.getUserByEmail(decoded.email);

      if (!user) {
        return errorResponse(req, res, {
          message: INVALID_TOKEN,
          status: 401,
        });
      }
      if (user.deleted === true || user.status === 'inactive') {
        return errorResponse(req, res, {
          message: 'You have been denied access to your account. Please contact Admin',
          status: 401,
        });
      }
      req.user = user;
      return next();
    } catch (err) {
      const dbError = new DBError({
        status: AUTH_FAILED,
        message: err.message,
      });
      moduleErrLogMessager(dbError);
      return next(err);
    }
  }
}
