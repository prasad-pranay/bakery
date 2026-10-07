import http from 'http';
import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { socketAuth } from './socket/socketAuth';
import { registerSupportHandlers } from './socket/supportSocket';

dotenv.config();

const PORT = 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bakery';

// Wrap the existing Express app in a native HTTP server.
// All existing Express routes and middleware continue to work unchanged.
const server = http.createServer(app);

// Attach Socket.IO to the same HTTP server.
// CORS origins match the existing Express CORS config in app.ts.
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://192.168.1.8:3000', 'http://localhost:3001'],
    credentials: true,
  },
});

// Apply JWT/cookie authentication to every socket before connection
io.use(socketAuth);

// Register all support-chat event handlers
registerSupportHandlers(io);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Use server.listen instead of app.listen — behaviour is identical
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
