const jwt = require('jsonwebtoken');

const socketAuthMiddleware = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      console.log('No token provided. Authentication failed.');
      return next(new Error('Authentication error: Token required'));
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.userId = decoded.id;

    next();
  } catch (error) {
    console.error('Invalid token:', error.message);
    next(new Error('Authentication error: Invalid token'));
  }
};

module.exports = { socketAuthMiddleware };
