const User = require('../../models/client/user.model');
const Post = require('../../models/client/post.model');
const slugify = require('slugify');
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
