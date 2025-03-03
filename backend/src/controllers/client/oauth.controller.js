const axios = require('axios');
const qs = require('qs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../../utils/jwtGenerate');
const User = require('../../models/client/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// [GET] /api/v1/oauth/google
module.exports.googleOAuth = async (req, res) => {
  const code = req.query.code;
  const url = 'https://oauth2.googleapis.com/token';
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
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

// [GET] /api/v1/oauth/facebook
module.exports.facebookOAuth = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ message: "Authorization code is missing" });
  }

  const url = "https://graph.facebook.com/v12.0/oauth/access_token";
  const values = {
    client_id: process.env.FACEBOOK_CLIENT_ID,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET,
    redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
    code,
  };

  try {
    // Exchange auth code for access token
    const result = await axios.get(`${url}?${qs.stringify(values)}`);
    const { access_token } = result.data;

    // Get user details from Facebook Graph API
    const userInfo = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${access_token}`
    );

    const facebookUser = userInfo.data;
    if (!facebookUser.email) {
      return res.status(403).json({ message: "Facebook email is required" });
    }

    let user = await User.findOne({ email: facebookUser.email, deleted: false });
    if (!user) {
      user = new User({
        email: facebookUser.email,
        avatar: facebookUser.picture.data.url,
        fullName: facebookUser.name,
        password: await bcrypt.hash(crypto.randomBytes(20).toString("hex"), parseInt(process.env.saltRounds)),
      });
      await user.save();
    }

    const { accessToken, refreshToken } = await generateToken(user);

    res.redirect(
      `http://localhost:5173/#access_token=${accessToken}&refresh_token=${refreshToken}`
    );

  } catch (err) {
    console.error("Facebook OAuth Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to authenticate with Facebook" });
  }
};