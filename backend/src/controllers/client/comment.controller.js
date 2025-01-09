const Comment = require('../../models/client/comment.model');
const User = require('../../models/client/user.model');
const Post = require('../../models/client/post.model');

// [POST] /api/v1/forum/comment/:id
module.exports.comment = async (req, res) => {
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
      content: req.body.content,
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

// [POST] /api/v1/forum/reply/:id
module.exports.reply = async (req, res) => {
  const id = req.params.id;
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      res.status(404).json({
        message: 'Cannot find comment!',
      });
      return;
    }

    comment.replies.push({
      userId: req.user.id,
      content: req.body.content,
    });

    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
