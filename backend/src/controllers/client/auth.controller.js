const User = require('../../models/client/user.model');
const hashPassword = require('../../utils/hashPassword');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../utils/jwtGenerate');
const Token = require('../../models/client/token.model');
require('dotenv').config();

// [POST] /api/v1/auth/signup
module.exports.signup = async (req, res) => {
  try {
    const email = req.body.email;
    const fullName = req.body.fullName;
    const checkUserExist = await User.findOne({
      email: email,
      deleted: false,
    });

    if (checkUserExist) {
      res.status(409).json({
        message: 'User already exists',
      });
      return;
    }

    const password = await hashPassword.hash(req.body.password);

    const user = new User({
      email: email,
      fullName: fullName,
      password: password,
    });

    await user.save();

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// [POST] /api/v1/auth/login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      email: email,
      deleted: false,
    });
    if (!existingUser) {
      res.status(404).json({
        message: 'User not found',
      });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordMatch) {
      res.status(403).json({
        message: 'Invalid password',
      });
      return;
    }

    const { accessToken, refreshToken } = await generateToken(existingUser);
    res.status(200).json({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// [DELETE] /api/v1/auth/logout
module.exports.logout = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({
        message: 'Invalid token format!',
      });
    }
    await Token.deleteOne({
      token: refreshToken,
    });
    res.status(200).json({
      message: 'Logged out successfully!',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
