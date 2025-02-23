const mongoose = require('mongoose');
const slugify = require('slugify');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: 'Your fullname is required',
    },
    slug: String,
    description: {
      type: String,
      default: '',
    },
    schools: [String],
    companies: [String],
    email: {
      type: String,
      unique: true,
      required: 'Your email is required',
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/cat-project/image/upload/v1735743336/coder-sign-icon-programmer-symbol-vector-2879989_ecvn23.webp',
    },
    password: {
      type: String,
      required: 'Your password is required',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    // followers: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    //   }
    // ]
  },
  { timestamps: true },
);

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('fullName')) return next();

  const slug = slugify(user.fullName, { trim: true, lower: true });
  user.slug = slug;

  next();
});

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.password;
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
