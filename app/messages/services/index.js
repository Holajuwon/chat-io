const messageDB = new Map();

export default class MessageServices {
  static async setRoom(receiverId, senderId) {
    const roomId = `${receiverId}-${senderId}`;
    const reverseRoomId = `${senderId}-${receiverId}`;

    if (messageDB.has(roomId)) {
      return roomId;
    }

    if (messageDB.has(reverseRoomId)) {
      return reverseRoomId;
    }

    messageDB.set(roomId, []);
    return roomId;
  }

  static async saveMessages(roomId, message) {
    messageDB.get(roomId).push(message);
  }
}
