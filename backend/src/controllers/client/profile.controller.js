const User = require('../../models/client/user.model');
const Post = require('../../models/client/post.model');
const slugify = require('slugify');
const hashPassword = require('../../utils/hashPassword');

// [GET] /api/v1/profile/detail/:id
module.exports.index = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.user && req.user.id === id) {
      const user = await User.findById(id)
        .populate({
          path: 'posts',
          match: { deleted: false },
          select: '_id title createdAt images',
        })
        .populate({
          path: 'savedPosts',
          match: { deleted: false },
          select: '_id title createdAt',
        });

      res.status(200).json(user);
    } else {
      const user = await User.findById(id)
        .populate({
          path: 'posts',
          match: { deleted: false },
          select: '_id title createdAt images',
        })
        .select('-savedPosts');
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// [PATCH] /api/v1/profile/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        message: 'Cannot find user',
      });
      return;
    }
    if (user._id.toString() !== req.user.id) {
      res.status(403).json({
        message: 'Only the owner of the account can edit it!',
      });
      return;
    }

    req.body.slug = slugify(req.body.fullName, { trim: true, lower: true });
    req.body.password = user.password;
    await User.updateOne({ _id: id }, req.body);
    res.status(200).json({
      message: 'Update successfully!',
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// [PATCH] /api/v1/profile/change-password/:id
module.exports.changePass = async (req, res) => {
  const id = req.params.id;
  const password = req.body.password;
  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({
      message: 'Cannot find user',
    });
    return;
  }
  if (req.user.id !== id) {
    res.status(403).json({
      message: 'Only the owner of the account can change the password!',
    });
    return;
  }
  user.password = await hashPassword.hash(password);
  await user.save();
  res.status(200).json({
    message: 'Change password successfully!',
  });
};
