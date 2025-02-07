const axios = require('axios');
const qs = require('qs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../../utils/jwtGenerate');
const User = require('../../models/client/user.model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// [GET] /api/v1/oauth/google
module.exports.oauth = async (req, res) => {
  const code = req.query.code;
  const url = 'https://oauth2.googleapis.com/token';
  const values = {
    code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
    grant_type: 'authorization_code',
  };

  try {
    const result = await axios.post(url, qs.stringify(values), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { id_token } = result.data;
    const googleUser = jwt.decode(id_token);
    if (!googleUser.email_verified) {
      res.status(403).json({
        message: 'Google account is not verified',
      });
      return;
    }

    let user = await User.findOne({
      email: googleUser.email,
      deleted: false,
    });
    if (!user) {
      user = new User({
        email: googleUser.email,
        avatar: googleUser.picture,
        fullName: googleUser.name,
        password: await bcrypt.hash(crypto.randomBytes(20).toString('hex'), parseInt(process.env.saltRounds)),
      });
      await user.save();
    }

    const { accessToken, refreshToken } = await generateToken(user);
    res.redirect(`http://localhost:5173/#access_token=${accessToken}&refresh_token=${refreshToken}`)

  } catch (err) {
    console.error(err, 'Failed to fetch Google Auth Token');
    res.status(400).json({
      message: err.message,
    });
  }
};
