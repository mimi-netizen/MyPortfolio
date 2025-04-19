class WebSocketManager {
  constructor() {
    this.clients = new Map();
  }

  addClient(userId, ws) {
    this.clients.set(userId, ws);
  }

  removeClient(userId) {
    this.clients.delete(userId);
  }

  sendMessage(userId, message) {
    const client = this.clients.get(userId);
    if (client) {
      client.send(JSON.stringify(message));
    }
  }

  broadcast(message, excludeUserId = null) {
    this.clients.forEach((ws, userId) => {
      if (userId !== excludeUserId) {
        ws.send(JSON.stringify(message));
      }
    });
  }
}

module.exports = new WebSocketManager();
