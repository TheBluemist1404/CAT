const User = require('../../models/client/user.model');
const Post = require('../../models/client/post.model');

// [GET] /api/v1/profile/:id
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
      const user = await User.findById(id).populate({
        path: 'posts',
        match: { deleted: false },
        select: '_id title createdAt images',
      }).select('-savedPosts');
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
