const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: 'Your fullname is required',
    },
    email: {
      type: String,
      unique: true,
      required: 'Your email is required',
    },
    avatar: {
      type: String,
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
  },
  { timestamps: true },
);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.password;
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
