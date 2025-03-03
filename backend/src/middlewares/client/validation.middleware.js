const axios = require('axios');
const Token = require('../../models/client/token.model');
const { checkEmailExists } = require('../../utils/verifyEmail');
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

module.exports.validateSignup = async (req, res, next) => {
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
  const email = req.body.email;
  
  // const data = {
  //   api_key: process.env.EMAIL_VERIFY_API_KEY,
  //   email_address: email,
  // };

  // const mailVerify = await axios.post(
  //   'https://verify.maileroo.net/check',
  //   data,
  //   {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   },
  // );

  
  const verify = await checkEmailExists(email)

  if (!verify) {
    res.status(404).json({
      message: 'Invalid email!',
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

module.exports.validateCreate = (req, res, next) => {
  if (!req.body.title) {
    res.status(400).json({
      message: 'Please enter title of the post!',
    });
    return;
  }
  next();
};

module.exports.validateEditProfile = (req, res, next) => {
  if (!req.body.fullName) {
    res.status(400).json({
      message: 'Please enter full name!',
    });
    return;
  }
  next();
};

module.exports.validateForgot = async (req, res, next) => {
  if (!req.body.email) {
    res.status(400).json({
      message: 'Please enter email!',
    });
    return;
  }
  const email = req.body.email;
  const data = {
    api_key: process.env.EMAIL_VERIFY_API_KEY,
    email_address: email,
  };

  const mailVerify = await axios.post(
    'https://verify.maileroo.net/check',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  if (mailVerify.data && !mailVerify.data.data.format_valid) {
    res.status(404).json({
      message: 'Invalid email!',
    });
    return;
  }
  next();
};

module.exports.validateOtp = (req, res, next) => {
  if (!req.body.email) {
    res.status(400).json({
      message: 'Please enter email!',
    });
    return;
  }
  if (!req.body.otp) {
    res.status(400).json({
      message: 'Please enter otp!',
    });
    return;
  }
  next();
};

module.exports.validateChangePass = (req, res, next) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password !== confirmPassword) {
    res.status(400).json({
      message: 'Please type the same password!',
    });
    return;
  }
  next();
};
