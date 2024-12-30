const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
    },
    content: String,
    images: [String],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
  },
  { timestamps: true },
);

postSchema.index({ tag: 1 });
postSchema.index({ userId: 1 });
postSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'postId',
});

const Post = mongoose.model('posts', postSchema);
module.exports = Post;
