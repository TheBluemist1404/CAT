const Token = require('../../models/client/token.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// [POST] /api/v1/token
module.exports.getNewToken = async (req, res) => {
  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, tokenDetail) => {
        if (err) {
          return res.status(400).json({
            message: 'Invalid refresh token!',
          });
        }
        const payload = {
          id: tokenDetail.id,
          email: tokenDetail.email,
        };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '10m',
        });

        res.status(200).json({
          message: "Access token created successfully",
          accessToken: accessToken
        })
      },
    );
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
};
