const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const WebSocket = require('ws');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Portfolio')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Create HTTP server
const server = require('http').createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  // Send welcome message immediately on connection
  ws.send(JSON.stringify({
    type: 'message',
    text: 'Hi there! How can I help you today?'
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);

      // Echo back messages with a bot-like delay
      if (data.type === 'message') {
        setTimeout(() => {
          ws.send(JSON.stringify({
            type: 'message',
            text: `Thanks for your message! You said: "${data.text}"`
          }));
        }, 1000);
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
