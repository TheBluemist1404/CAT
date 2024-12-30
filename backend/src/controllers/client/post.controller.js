const Post = require('../../models/client/post.model');
const User = require('../../models/client/user.model');
const Like = require('../../models/client/like.model');

// [GET] /api/v1/forum/
module.exports.index = async (req, res) => {
  let skip = parseInt(req.query.offset) || 0;
  let limit = parseInt(req.query.limit) || 10;
  try {
    const posts = await Post.find({
      deleted: false,
      status: 'public',
    })
      .populate({
        path: 'likes',
        select: 'userId -_id -postId',
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });

    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// [POST] /api/v1/forum/create
module.exports.create = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    req.body.userId = user._id;
    console.log(req.body);
    const post = new Post(req.body);
    const savedPost = await post.save();

    user.posts = user.posts.concat(savedPost._id);
    await user.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
