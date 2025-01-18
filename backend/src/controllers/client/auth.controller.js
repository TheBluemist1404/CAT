const User = require('../../models/client/user.model');
const hashPassword = require('../../utils/hashPassword');
const bcrypt = require('bcrypt');
const { generateToken, otpToken } = require('../../utils/jwtGenerate');
const Token = require('../../models/client/token.model');
const Otp = require('../../models/client/otp.model');
const { hashingOtp } = require('../../utils/otpHashing');
const { sendMail } = require('../../utils/sendMail');
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

// [POST] /api/v1/auth/forgot
module.exports.forgot = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({
      email: email,
      deleted: false,
    });
    if (!user) {
      res.status(404).json({
        message: 'User does not exist!',
      });
      return;
    }

    await Otp.deleteMany({ email: user.email });

    const { randomOtp, hashOtp } = await hashingOtp(1000000);
    const newOtp = new Otp({
      otp: hashOtp,
      email: email,
    });

    await newOtp.save();
    const subject = 'CAT - OTP Verification';
    const html = `<html lang='vi'>
  <head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <title>OTP Verification</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333;
      max-width: 600px; margin: 0 auto; padding: 20px; } .container {
      background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top:
      20px; } .logo { text-align: center; margin-bottom: 20px; } .logo img {
      max-width: 150px; } h1 { color: #33CC66; } .otp { font-size: 24px;
      font-weight: bold; text-align: center; margin: 20px 0; padding: 20px;
      background-color: #33CC66; color: "white"; border-radius: 10px; } .footer
      { margin-top: 20px; text-align: center; font-size: 12px; color: #888; }
    </style>
  </head>
  <body>
    <div class='container'>
      <div class='logo'>
      </div>
      <h1 style="text-align: center;">CAT</h1>

      <p>Hello ${user.fullName},</p>
      <p>To complete your password recovery,
        please use the following One - Time Password (OTP) to verify your email
        address:</p>

      <div class='otp'>${randomOtp}</div>
      <p>This OTP is valid for the next 5 minutes. If you didn't request this
        verification, please ignore this email.</p>
      <p>If you have any questions or need assistance, please don't hesitate to
        contact our support team.</p>
      <p>Best regards,<br />The CAT Team</p>
    </div>
    <div class='footer'>
      <p>This is an automated message, please do not reply to this email.</p>
      <p>&copy; 2024 CAT. All rights reserved.</p>
    </div>
  </body>
</html>`;
    await sendMail(email, subject, html);
    res.status(200).json({
      message: 'Please check your email and type in otp!',
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// [POST] /api/v1/auth/otp
module.exports.otp = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const checkOtpExist = await Otp.findOne({ email: email }).sort({
    createdAt: -1,
  });
  if (!checkOtpExist) {
    res.status(404).json({
      message: 'Email or otp does not exist!',
    });
    return;
  }

  const isOtpMatch = await bcrypt.compare(otp, checkOtpExist.otp);
  if (!isOtpMatch) {
    res.status(403).json({
      message: 'Invalid otp!',
    });
    return;
  }

  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  const token = await otpToken(user);

  res.status(200).json({
    otpToken: token,
  });
};

// [POST] /api/v1/auth/reset-password
module.exports.changePassword = async (req, res) => {
  const password = req.body.password;
  const user = await User.findById(req.user.id);
  user.password = await hashPassword.hash(password);
  await user.save();
  res.status(200).json({
    message: 'Change password successfully!',
  });
};
