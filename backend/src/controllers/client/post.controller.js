const Post = require('../../models/client/post.model');
const User = require('../../models/client/user.model');
const Like = require('../../models/client/like.model');
const Comment = require('../../models/client/comment.model');

// [GET] /api/v1/forum?offset=...&limit=...
module.exports.index = async (req, res) => {
  let skip = parseInt(req.query.offset) || 0;
  let limit = parseInt(req.query.limit) || 10;
  try {
    const posts = await Post.find({
      deleted: false,
      status: 'public',
    })
      .populate({
        path: 'userCreated',
        select: '_id fullName avatar',
      })
      .populate({
        path: 'upvotes',
        select: 'userId -_id -postId',
        match: { typeVote: 'upvote' },
      })
      .populate({
        path: 'downvotes',
        select: 'userId -_id -postId',
        match: { typeVote: 'downvote' },
      })
      .populate({
        path: 'comments',
        perDocumentLimit: 3,
        options: { sort: { createdAt: -1 } },
        select: 'content userId -postId',
        populate: [
          {
            path: 'userId',
            select: '_id fullName avatar',
          },
          {
            path: 'replies.userId',
            select: '_id fullName avatar',
          },
        ],
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });
      
    for (const post of posts) {
      post.comments.forEach(comment => {
        if (comment.replies.length > 0) {
          comment.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
      });
    }
    
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
    req.body.userCreated = user._id;
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

// [GET] /api/v1/forum/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id)
      .populate({
        path: 'userCreated',
        select: '_id fullName avatar',
      })
      .populate({
        path: 'upvotes',
        select: 'userId -_id -postId',
        match: { typeVote: 'upvote' },
      })
      .populate({
        path: 'downvotes',
        select: 'userId -_id -postId',
        match: { typeVote: 'downvote' },
      })
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        select: 'content userId -postId',
        populate: [
          {
            path: 'userId',
            select: '_id fullName avatar',
          },
          {
            path: 'replies.userId',
            select: '_id fullName avatar',
          },
        ],
      });
    if (post.status !== 'public' || post.deleted === true) {
      res.status(404).json({
        message: 'Cannot find post!',
      });
      return;
    }
    post.comments.forEach(comment => {
      if (comment.replies.length > 0) {
        comment.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    });
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
