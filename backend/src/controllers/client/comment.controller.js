const Comment = require('../../models/client/comment.model');
const User = require('../../models/client/user.model');
const Post = require('../../models/client/post.model');

// [POST] /api/v1/forum/comment/:id
module.exports.comment = async (req, res) => {
  // const user = await User.findById(req.user.id);
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({
        message: 'Cannot find post',
      });
      return;
    }

    const comment = new Comment({
      ...req.body,
      userId: req.user.id,
      postId: id,
    });

    const savedComment = await comment.save();
    
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
