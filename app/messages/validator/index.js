import Joi from 'joi';

export default class LiveServiceValidator {
  static async getUserValidator(socket, packet) {
    try {
      const schema = Joi.object({
        ReceiverUserId: Joi.string().uuid().label('Receiver Id').required(),
      });
      await schema.validateAsync({ ReceiverUserId: packet[1].ReceiverUserId });
      return true;
    } catch (err) {
      socket.emit('error', {
        message: 'validation error',
        code: 400,
        status: 'failed',
        data: err.message.replace(/["]/gi, ''),
      });
      return {
        message: err.message.replace(/["]/gi, ''),
        status: 400,
        err,
      };
    }
  }
}
