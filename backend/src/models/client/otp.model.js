const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema(
  {
    email: String,
    otp: String, // store hashed otp
    expireAt: {
      type: Date,
      default: () => Date.now(),
      expires: 300, // 5 mins
    },
  },
  { timestamps: true },
);

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
