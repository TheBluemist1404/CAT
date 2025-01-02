const User = require('../../models/client/user.model');
const Post = require('../../models/client/post.model');

// [GET] /api/v1/profile/me
module.exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
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
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
