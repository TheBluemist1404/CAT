const Token = require('../../models/client/token.model');
module.exports.validateLogin = (req, res, next) => {
  if (!req.body.email) {
    res.status(400).json({
      message: 'Please enter email!',
    });
    return;
  }
  if (!req.body.password) {
    res.status(400).json({
      message: 'Please enter password!',
    });
    return;
  }
  next();
};

module.exports.validateSignup = (req, res, next) => {
  if (!req.body.fullName) {
    res.status(400).json({
      message: 'Please enter full name!',
    });
    return;
  }
  if (!req.body.email) {
    res.status(400).json({
      message: 'Please enter email!',
    });
    return;
  }
  if (!req.body.password) {
    res.status(400).json({
      message: 'Please enter password!',
    });
    return;
  }
  next();
};

module.exports.validateRefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({
      message: 'Invalid token format!',
    });
  }
  const token = await Token.findOne({
    token: refreshToken,
  });
  if (!token) {
    return res.status(400).json({
      message: 'Invalid refresh token. Please login again!',
    });
  }
  next();
};
