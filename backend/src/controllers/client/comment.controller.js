const Comment = require('../../models/client/comment.model');
const User = require('../../models/client/user.model');
const Post = require('../../models/client/post.model');
const { initializeRedisClient } = require('../../utils/redis');

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
    const user = await User.findById(req.user.id);
    const comment = new Comment({
      content: req.body.content,
      userId: req.user.id,
      postId: id,
    });

    const savedComment = await comment.save();

    const redisClient = await initializeRedisClient();
    redisClient.get(
      `${process.env.CACHE_PREFIX}:post:${savedComment.postId.toString()}`,
      async (err, cachedPost) => {
        if (err) throw new Error(err.message);
        if (cachedPost) {
          const cachedData = JSON.parse(cachedPost);
          cachedData.comments.push({
            content: savedComment.content,
            replies: [],
            createdAt: new Date(savedComment.createdAt),
            userDetails: {
              _id: req.user.id,
              fullName: user.fullName,
              avatar: user.avatar,
            },
          });

          await redisClient.setEx(`${process.env.CACHE_PREFIX}:post:${savedComment.postId.toString()}`, 600, JSON.stringify(cachedData));
        }
      },
    );

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
