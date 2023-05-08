/* eslint-disable import/no-cycle */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import genericError from '../error/generic';
import constants from '../constants';
import DBError from '../error/db.error';
import config from '../../config';

const { serverError } = genericError;
const { FAIL, SUCCESS, SUCCESS_RESPONSE } = constants;

/**
 *Contains Helper methods
 * @class Helper
 */
class Helper {
  /**
   * This is used for generating a hash and a salt from a String.
   * @static
   * @param {string} plainString - String to be encrypted.
   * @memberof Helper
   * @returns {Object} - An object containing the hash and salt of a String.
   */
  static hashString(plainString) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainString, salt);
  }

  /**
   * This checks if a plain text matches a certain hash value
   * @static
   * @param {string} plain - plain text to be used in the comparison.
   * @param {string} hash - hashed value created with the salt.
   * @memberof Helper
   * @returns {boolean} - returns a true or false, depending on the outcome of the comparison.
   */
  static compareHash(password, hashedPassword) {
    const validPassword = bcrypt.compareSync(password, hashedPassword);
    return !!validPassword;
  }

  /**
   * Synchronously signs the given payload into a JSON Web Token string.
   * @static
   * @param {string | number | Buffer | object} payload - payload to sign
   * @param {string | number} expiresIn - Expressed in seconds or a string describing a
   * time span. Eg: 60, "2 days", "10h", "7d". Default specified is 2 hours.
   * @memberof Helper
   * @returns {string} - JWT Token
   */
  static generateToken(payload, expiresIn = config.JWT_EXPIRY) {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn });
  }

  /**
   * This verify the JWT token with the secret with which the token was issued with
   * @static
   * @param {string} token - JWT Token
   * @memberof Helper
   * @returns {string | number | Buffer | object } - Decoded JWT payload if
   * token is valid or an error message if otherwise.
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
      return error;
    }
  }

  /**
   * Creates DB Error object and logs it with respective error message and status.
   * @static
   * @param { String | Object } data - The data.
   * @memberof Helper
   * @returns { Object } - It returns an Error Object.
   */
  static makeError({ error, status }) {
    const dbError = new DBError({
      status,
      message: error.message,
    });
    Helper.moduleErrLogMessager(dbError);
    return dbError;
  }

  /**
   * Generates a JSON response for success scenarios.
   * @static
   * @param {Response} res - Response object.
   * @param {object} options - An object containing response properties.
   * @param {object} options.data - The payload.
   * @param {string} options.message -  HTTP Status code.
   * @param {number} options.code -  HTTP Status code.
   * @memberof Helpers
   * @returns {JSON} - A JSON success response.
   */
  static successResponse(
    res,
    { data, message = SUCCESS_RESPONSE, code = 200 },
  ) {
    return res.status(code).json({
      status: SUCCESS,
      code,
      message,
      data,
    });
  }

  /**
   * Generates a JSON response for failure scenarios.
   * @static
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {object} error - The error object.
   * @param {number} error.status -  HTTP Status code, default is 500.
   * @param {string} error.message -  Error message.
   * @param {object|array} error.errors -  A collection of  error message.
   * @memberof Helpers
   * @returns {JSON} - A JSON failure response.
   */
  static errorResponse(req, res, error) {
    const aggregateError = { ...serverError, ...error };
    Helper.apiErrLogMessager(aggregateError, req);
    return res.status(aggregateError.status).json({
      status: FAIL,
      message: aggregateError.message,
      code: aggregateError.status,
      errors: aggregateError.errors,
    });
  }

  /**
   * Generates log for module errors.
   * @static
   * @param {object} error - The module error object.
   * @memberof Helpers
   * @returns { Null } -  It returns null.
   */
  static moduleErrLogMessager(error) {
    return logger.error(`${error.status} - ${error.name} - ${error.message}`);
  }

  /**
   * Generates log for api errors.
   * @static
   * @private
   * @param {object} error - The API error object.
   * @param {Request} req - Request object.
   * @memberof Helpers
   * @returns {String} - It returns null.
   */
  static apiErrLogMessager(error, req) {
    logger.error(
      `${error.name} - ${error.status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
  }

  static formatSQL(data) {
    let format = '';
    for (let i = 0; i < data.length; i++) {
      // Escape apostrophes
      const escapedValues = data[i].map((value) => String(value).replace(/'/g, '\'\''));

      if (i === data.length - 1) {
        format += `('${escapedValues.join('\', \'')}')`;
      } else {
        format += `('${escapedValues.join('\', \'')}'),`;
      }
    }
    return format;
  }

  static hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);
    return { salt, hashed };
  }

  static comparePassword(password, hashed) {
    return bcrypt.compare(password, hashed);
  }
}

export default Helper;
