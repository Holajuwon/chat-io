import { Server } from 'socket.io';
import { v4 as uuidV4 } from 'uuid';
import LiveMiddleware from './middlewares';
import MessageServices from './services';

export default async (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  const connections = io.of('/');
  connections.use(LiveMiddleware.verifyAuth);

  connections.on('connection', async (socket) => {
    socket.on('error', () => {});
    LiveMiddleware.validateJoinRoom(socket);

    logger.info(`${socket.id} :::: socket ID :::::`);
    socket.emit('connection-success', { socketId: socket.id });

    socket.on('disconnect', async () => {
      logger.info('peer disconnected');
    });

    socket.on('joinRoom', async ({ ReceiverUserId }) => {
      const { user } = socket.handshake;
      const roomId = await MessageServices.setRoom(ReceiverUserId, user.id);
      socket.join(roomId);
      socket.on('message', async ({ message }) => {
        const newMessage = {
          messageId: uuidV4(),
          senderUserId: user.id,
          receiverUserId: ReceiverUserId,
          message,
          timeStamp: new Date(),
          roomId
        };
        await MessageServices.saveMessages(roomId, newMessage);
        connections.to(roomId).emit('new-message', newMessage);
      });
    });
  });
};
