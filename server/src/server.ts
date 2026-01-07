import express, { Express, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import matchRoutes from './routes/match';
import chatRoutes from './routes/chat';
import subscriptionRoutes from './routes/subscription';
import passwordResetRoutes from './routes/passwordReset';

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));

// Health check
app.get('/health', (req, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', passwordResetRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join user to their private room
  socket.on('join-user', (userId: string) => {
    socket.join(`user-${userId}`);
  });

  // Handle incoming messages
  socket.on('send-message', (data: any) => {
    io.to(`user-${data.targetUserId}`).emit('new-message', data);
  });

  // Handle typing indicator
  socket.on('typing', (data: any) => {
    io.to(`user-${data.targetUserId}`).emit('user-typing', {
      userId: data.userId,
      chatId: data.chatId
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mallucupid');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

export { app, httpServer, io };
