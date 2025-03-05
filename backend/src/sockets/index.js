const { Server } = require('socket.io');
const { socketAuthMiddleware } = require('./middleware');

const io = new Server({
  cors: {
    origin: '*',
  },
});

const userSockets = new Map();

io.use(socketAuthMiddleware);

io.on('connection', socket => {
  // console.log('New client connected:', socket.id);

  userSockets.set(socket.userId, socket.id);
  console.log(`User ${socket.userId} registered with socket ${socket.id}`);

  socket.on('disconnect', () => {
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    }
  });
});

module.exports = { io, userSockets };
