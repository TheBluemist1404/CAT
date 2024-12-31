const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
      minlength: 1,
    },
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        content: {
          type: String,
          required: true,
          minlength: 1,
        },
        createdAt: {
          type: Date,
          default: () => Date.now(),
        },
      },
    ],
  },
  { timestamps: true },
);

commentSchema.index({ postId: 1 });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
