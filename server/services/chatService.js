const Message = require('../models/Message');

class ChatService {
  async saveMessage(senderId, content, attachments = []) {
    const message = new Message({
      sender: senderId,
      content,
      attachments,
      timestamp: new Date()
    });
    await message.save();
    return message;
  }

  async getRecentMessages(limit = 50) {
    return await Message.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('sender', 'username')
      .exec();
  }

  async markAsRead(messageId, userId) {
    await Message.findByIdAndUpdate(messageId, {
      read: true,
      readAt: new Date()
    });
  }
}

module.exports = new ChatService();
