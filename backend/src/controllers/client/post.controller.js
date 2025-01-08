const Post = require('../../models/client/post.model');
const User = require('../../models/client/user.model');
const Like = require('../../models/client/like.model');
const Comment = require('../../models/client/comment.model');
const Tag = require('../../models/client/tag.model');
const slugify = require('slugify');
const { getDetail } = require('../../services/client/getDetail.service');
const { initializeRedisClient } = require('../../utils/redis');

// [GET] /api/v1/forum?offset=...&limit=...
module.exports.index = async (req, res) => {
  const skip = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const posts = await Post.aggregate([
      { $match: { deleted: false, status: 'public' } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'userCreated',
          foreignField: '_id',
          as: 'userCreated',
        },
      },
      { $unwind: '$userCreated' },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'postId',
          as: 'upvotes',
          pipeline: [
            { $match: { typeVote: 'upvote' } },
            { $project: { userId: 1, _id: 0 } },
          ],
        },
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'postId',
          as: 'downvotes',
          pipeline: [
            { $match: { typeVote: 'downvote' } },
            { $project: { userId: 1, _id: 0 } },
          ],
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'postId',
          as: 'comments',
          pipeline: [
            { $sort: { createdAt: -1 } },
            { $limit: 3 },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userDetails',
              },
            },
            { $unwind: '$userDetails' },
          ],
        },
      },
      {
        $lookup: {
          from: 'tags',
          localField: 'tags',
          foreignField: '_id',
          as: 'tags',
        },
      },
      {
        $lookup: {
          from: 'saves',
          localField: '_id',
          foreignField: 'savedPosts',
          as: 'saves',
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          createdAt: 1,
          userCreated: { _id: 1, fullName: 1, avatar: 1 },
          upvotes: 1,
          downvotes: 1,
          comments: {
            content: 1,
            createdAt: 1,
            userDetails: { _id: 1, fullName: 1, avatar: 1 },
          },
          tags: { _id: 1, title: 1 },
          saves: { _id: 1 },
        },
      },
    ]);
  res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
    const redisClient = await initializeRedisClient();
    const id = req.params.id;
    const [post, cacheHit] = await getDetail(id);

    if (!post || post.status !== 'public' || post.deleted === true) {
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

    if (!cacheHit) {
      await redisClient.setEx(
        `${process.env.CACHE_PREFIX}:post:${id}`,
        600,
        JSON.stringify(post),
      );
    }

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
