const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
      minlength: 1,
      lowercase: true,
    },
  },
  { timestamps: true },
);

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
