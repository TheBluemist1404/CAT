const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
