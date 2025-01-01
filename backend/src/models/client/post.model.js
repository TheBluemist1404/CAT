const mongoose = require('mongoose');
const slugify = require('slugify');

const opt = { toJSON: { virtuals: true }, timestamps: true, id: false };

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
    },
    slug: {
      type: String,
    },
    content: String,
    images: [String],
    userCreated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
  opt,
);

postSchema.index({ tags: 1 });
postSchema.index({ userId: 1 });

postSchema.virtual('upvotes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'postId',
});

postSchema.virtual('downvotes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'postId',
});

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId',
});

postSchema.pre('save', async function (next) {
  const post = this;

  if (!post.isModified('title')) return next();

  const slug = slugify(post.title, { lower: true, trim: true });
  post.slug = slug;
  next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
