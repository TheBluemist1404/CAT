const Post = require('../../models/client/post.model');

// [GET] /api/v1/forum/
module.exports.index = async (req, res) => {
  let skip = parseInt(req.query.offset) || 0;
  let limit = parseInt(req.query.limit) || 10;
  try {
    const posts = await Post.find({
      deleted: false,
      status: 'public',
    })
      .populate('likes')
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
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
