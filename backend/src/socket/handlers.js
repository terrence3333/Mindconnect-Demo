const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');

const initializeSocket = (httpServer) => {
  const io = socketIO(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.fullName} (${socket.userId})`);

    // Join a support group room
    socket.on('join-group', async (groupId) => {
      try {
        socket.join(`group-${groupId}`);
        console.log(`User ${socket.userId} joined group ${groupId}`);
        
        // Load recent messages
        const messages = await Message.find({ group: groupId })
          .populate('user', 'fullName')
          .sort({ createdAt: -1 })
          .limit(50);
        
        socket.emit('previous-messages', messages.reverse());
        
        // Notify others
        socket.to(`group-${groupId}`).emit('user-joined', {
          userId: socket.userId,
          userName: socket.user.fullName
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to join group' });
      }
    });

    // Leave a support group room
    socket.on('leave-group', (groupId) => {
      socket.leave(`group-${groupId}`);
      console.log(`User ${socket.userId} left group ${groupId}`);
      
      socket.to(`group-${groupId}`).emit('user-left', {
        userId: socket.userId,
        userName: socket.user.fullName
      });
    });

    // Send message to group
    socket.on('send-message', async (data) => {
      try {
        const { groupId, content } = data;
        
        // Save message to database
        const message = await Message.create({
          group: groupId,
          user: socket.userId,
          content: content
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('user', 'fullName');

        // Broadcast to all users in the group
        io.to(`group-${groupId}`).emit('new-message', populatedMessage);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', (groupId) => {
      socket.to(`group-${groupId}`).emit('user-typing', {
        userId: socket.userId,
        userName: socket.user.fullName
      });
    });

    socket.on('stop-typing', (groupId) => {
      socket.to(`group-${groupId}`).emit('user-stop-typing', {
        userId: socket.userId
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.fullName}`);
    });
  });

  return io;
};

module.exports = { initializeSocket };
