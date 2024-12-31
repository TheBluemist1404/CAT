const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({
      message: 'Unauthorized: Missing token!',
    });
  }
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Unauthorized: Invalid token format!',
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: 'Forbidden: Invalid or expired token!',
      });
    }
    req.user = user;
    next();
  });
};
