const Post = require('../../models/client/post.model');
const User = require('../../models/client/user.model');
const Like = require('../../models/client/like.model');
const Comment = require('../../models/client/comment.model');
const Tag = require('../../models/client/tag.model');
const slugify = require('slugify');

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
      .populate({
        path: 'tags',
        select: '_id title',
      })
      .populate({
        path: 'saves',
        select: '_id -savedPosts',
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 'desc' });

    for (const post of posts) {
      post.comments.forEach(comment => {
        if (comment.replies.length > 0) {
          comment.replies.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
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
      })
      .populate({
        path: 'saves',
        select: '_id -savedPosts',
      });
    if (post.status !== 'public' || post.deleted === true) {
      res.status(404).json({
        message: 'Cannot find post!',
      });
      return;
    }
    post.comments.forEach(comment => {
      if (comment.replies.length > 0) {
        comment.replies.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      }
    });
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// [GET] /api/v1/forum/tags
module.exports.tags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// [POST] /api/v1/forum/save/:id
module.exports.save = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id).select('_id');
    if (!post) {
      res.status(404).json({
        message: 'Cannot find post!',
      });
      return;
    }

    const user = await User.findById(req.user.id);

    if (user.savedPosts.includes(id)) {
      const idx = user.savedPosts.indexOf(id);
      user.savedPosts.splice(idx, 1);
      await user.save();
      res.status(200).json({
        message: 'Unsave successfully!',
      });
      return;
    }

    user.savedPosts.push(id);
    await user.save();
    res.status(200).json({
      message: 'Save successfully!',
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// [PATCH] /api/v1/forum/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({
        message: 'Cannot find post!',
      });
      return;
    }
    if (post.userCreated.toString() !== req.user.id) {
      res.status(403).json({
        message: 'Only the author can edit post!',
      });
      return;
    }

    req.body.slug = slugify(req.body.title, { lower: true, trim: true });

    await Post.updateOne({ _id: id }, req.body);
    res.status(200).json({
      message: 'Update successfully!',
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
