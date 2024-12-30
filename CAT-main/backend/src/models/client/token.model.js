const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    expireAt: {
      type: Date,
      default: () => Date.now(),
      expires: 3600 * 24 * 30, // 30 days
    },
  },
  { timestamps: true },
);

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;
