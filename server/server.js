const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const wsManager = require('./utils/wsManager');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Serve static files from Portfolio directory
app.use(express.static(path.join(__dirname, '../Portfolio')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Serve admin files
app.use('/admin', express.static(path.join(__dirname, '../Portfolio/admin')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle admin routes
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Portfolio/admin/index.html'));
});

// WebSocket connection handling
wss.on('connection', async (ws, req) => {
  try {
    const token = req.url.split('token=')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    wsManager.addClient(userId, ws);

    ws.on('message', async (message) => {
      const data = JSON.parse(message);
      switch (data.type) {
        case 'typing':
          wsManager.broadcast({ type: 'typing', userId }, userId);
          break;
        case 'message':
          // Save message to database
          const newMessage = await Message.create({
            sender: userId,
            content: data.text
          });
          wsManager.broadcast({
            type: 'message',
            message: newMessage
          });
          break;
      }
    });

    ws.on('close', () => {
      wsManager.removeClient(userId);
    });
  } catch (error) {
    ws.close();
  }
});

// Routes
app.use('/api/chat', require('./routes/chat'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
