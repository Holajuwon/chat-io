/* eslint-disable no-param-reassign */
import { Helper, DBError, constants } from '../../utils/index';
import AuthService from '../../user/service/auth.service';
import LiveServiceValidator from '../validator';

const { moduleErrLogMessager, verifyToken, } = Helper;
const { AUTH_FAILED, AUTH_REQUIRED, INVALID_TOKEN, RESOURCE_NOT_FOUND } = constants;

export default class LiveMiddleware {
  static async verifyAuth(socket, next) {
    try {
      const bearerToken = socket.handshake.auth.token;
      if (!bearerToken) {
        logger.error(AUTH_REQUIRED);
        socket.emit('error', {
          message: AUTH_REQUIRED,
          code: 401,
          status: 'failed',
        });
        return next(new Error(AUTH_REQUIRED));
      }
      const decoded = verifyToken(bearerToken);
      if (decoded.message) {
        logger.error(decoded.message);
        socket.emit('error', {
          message: decoded.message,
          code: 401,
          status: 'failed',
        });
        return next(new Error(decoded.message));
      }

      const user = await AuthService.getUserByEmail(decoded.email);

      if (!user) {
        logger.error(INVALID_TOKEN);
        socket.emit('error', {
          message: INVALID_TOKEN,
          code: 401,
          status: 'failed',
        });
        return next(new Error('Unauthorized'));
      }
      const { hashed_password, ...userData } = user;
      socket.handshake.user = userData;

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

  static async verifyReceiver(socket, packet, next) {
    try {
      const user = await AuthService.getUserById(packet[1].ReceiverUserId);
      if (!user) {
        logger.error(RESOURCE_NOT_FOUND('Receiver'),);
        socket.emit('error', {
          message: RESOURCE_NOT_FOUND('Receiver'),
          code: 404,
          status: 'failed',
        });
        return next(new Error(RESOURCE_NOT_FOUND('Receiver')));
      }
      return next();
    } catch (err) {
      const dbError = new DBError({
        status: RESOURCE_NOT_FOUND('Receiver'),
        message: err.message,
      });
      moduleErrLogMessager(dbError);
      return next();
    }
  }

  static async validateJoinRoom(socket) {
    socket.use(async (packet, next) => {
      if (packet[0] === 'joinRoom') {
        const valid = await LiveServiceValidator.getUserValidator(
          socket,
          packet,
        );
        if (valid) {
          return LiveMiddleware.verifyReceiver(socket, packet, next);
        }
        return next(valid);
      }
      next();
    });
  }
}
