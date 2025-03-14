const jwt = require('jsonwebtoken');
const Token = require('../models/client/token.model');
require('dotenv').config();

module.exports.generateToken = async user => {
  const payload = {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    avatar: user.avatar,
  };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '10m',
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });

  await Token.deleteOne({
    userId: user._id,
  });

  await new Token({
    userId: user._id,
    token: refreshToken,
  }).save();

  return { accessToken, refreshToken };
};

module.exports.otpToken = async user => {
  const payload = {
    id: user._id,
    email: user.email,
  };
  const otpToken = jwt.sign(payload, process.env.OTP_TOKEN_SECRET, {
    expiresIn: '5m',
  });
  return otpToken;
};
