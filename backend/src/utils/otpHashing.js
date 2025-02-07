const bcrypt = require('bcrypt');
//require('dotenv').config();

module.exports.hashingOtp = async () => {
  const randomOtp = `${Math.floor(100000 + Math.random() * 900000)}`;
  const salt = parseInt(process.env.saltRounds);
  const hashOtp = await bcrypt.hash(randomOtp, salt);
  return { randomOtp, hashOtp };
};
