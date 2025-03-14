const Post = require('../../models/client/post.model');
const User = require('../../models/client/user.model');
const Like = require('../../models/client/like.model');
const Comment = require('../../models/client/comment.model');
const Follower = require('../../models/client/follower.model');
const Tag = require('../../models/client/tag.model');
const slugify = require('slugify');
const { getDetail } = require('../../services/client/getDetail.service');
const { initializeRedisClient } = require('../../utils/redis');
const { publishNotification } = require('../../utils/notificationWorker');

// [GET] /api/v1/forum?offset=...&limit=...
module.exports.index = async (req, res) => {
  const skip = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const posts = await Post.aggregate([
      { $match: { deleted: false, status: 'public' } },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          posts: [
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
                  {
                    $lookup: {
                      from: 'users',
                      localField: 'replies.userId',
                      foreignField: '_id',
                      as: 'replyUsers',
                    },
                  },
                  {
                    $addFields: {
                      replies: {
                        $map: {
                          input: '$replies',
                          as: 'reply',
                          in: {
                            content: '$$reply.content',
                            createdAt: '$$reply.createdAt',
                            userDetails: {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: '$replyUsers',
                                    as: 'user',
                                    cond: {
                                      $eq: ['$$user._id', '$$reply.userId'],
                                    },
                                  },
                                },
                                0,
                              ],
                            },
                          },
                        },
                      },
                    },
                  },
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
                from: 'users',
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
                images: 1,
                slug: 1,
                createdAt: 1,
                userCreated: { _id: 1, fullName: 1, avatar: 1 },
                upvotes: 1,
                downvotes: 1,
                comments: {
                  _id: 1,
                  content: 1,
                  createdAt: 1,
                  userDetails: { _id: 1, fullName: 1, avatar: 1 },
                  replies: {
                    content: 1,
                    createdAt: 1,
                    userDetails: { _id: 1, fullName: 1, avatar: 1 },
                  },
                },
                tags: { _id: 1, title: 1 },
                saves: { _id: 1 },
              },
            },
          ],
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
    const redisClient = await initializeRedisClient();

    const user = await User.findById(req.user.id);
    
    req.body.userCreated = user._id;
    const post = new Post(req.body);
    const savedPost = await post.save();

    user.posts = user.posts.concat(savedPost._id);
    await user.save();

    const followers = await Follower.find({ followeeId: user._id });

    await publishNotification(
      notificationProducer,
      'notification',
      'post',
      user._id,
      followers.map(f => f.followerId),
      `${user.fullName} has just created a post`,
      { postId: post._id },
    );

    //update cache
    const key = `${process.env.CACHE_PREFIX}:profile:${req.user.id}`;
    const checkCacheExist = await redisClient.get(key);
    if (checkCacheExist) {
      const data = JSON.parse(checkCacheExist);
      data.posts.push({
        _id: savedPost._id.toString(),
        title: savedPost.title,
        status: savedPost.status,
        createdAt: new Date(savedPost.createdAt),
      });
      await redisClient.setEx(key, 600, JSON.stringify(data));
    }

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

    if (
      !post ||
      (post.status === 'private' &&
        req.user.id !== post.userCreated._id.toString())
    ) {
      res.status(404).json({
        message: 'Cannot find post!',
      });
      return;
    }

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
    const redisClient = await initializeRedisClient();
    const cacheTags = await redisClient.get(`${process.env.CACHE_PREFIX}:tags`);
    if (cacheTags) {
      res.status(200).json(JSON.parse(cacheTags));
      return;
    }

    const tags = await Tag.find();

    await redisClient.set(
      `${process.env.CACHE_PREFIX}:tags`,
      JSON.stringify(tags),
    );

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
    const redisClient = await initializeRedisClient();

    const id = req.params.id;
    const post = await Post.findById(id).select('_id title createdAt');
    if (!post || post.deleted === true) {
      res.status(404).json({
        message: 'Cannot find post!',
      });
      return;
    }

    const user = await User.findById(req.user.id);

    const postKey = `${process.env.CACHE_PREFIX}:post:${id}`;
    const userKey = `${process.env.CACHE_PREFIX}:profile:${req.user.id}`;

    // Update post cache
    const postCache = await redisClient.get(postKey);
    if (postCache) {
      const cachedData = JSON.parse(postCache);
      const idx = cachedData.saves.findIndex(save => save._id === req.user.id);
      if (idx !== -1) {
        cachedData.saves.splice(idx, 1);
      } else {
        cachedData.saves.push({ _id: req.user.id });
      }
      await redisClient.setEx(postKey, 600, JSON.stringify(cachedData));
    }

    if (user.savedPosts.includes(id)) {
      const idx = user.savedPosts.indexOf(id);
      user.savedPosts.splice(idx, 1);
      await user.save();

      const userCache = await redisClient.get(userKey);
      if (userCache) {
        const cachedData = JSON.parse(userCache);
        const cacheIdx = cachedData.savedPosts.findIndex(
          post => post._id === id,
        );
        if (cacheIdx > -1) {
          cachedData.savedPosts.splice(cacheIdx, 1);
          await redisClient.setEx(userKey, 600, JSON.stringify(cachedData));
        }
      }

      res.status(200).json({
        message: 'Unsave successfully!',
      });
      return;
    }

    user.savedPosts.push(id);
    await user.save();

    // Update user cache
    const userCache = await redisClient.get(userKey);
    if (userCache) {
      const cachedData = JSON.parse(userCache);
      cachedData.savedPosts.push({
        _id: id,
        title: post.title,
        createdAt: post.createdAt,
      });
      await redisClient.setEx(userKey, 600, JSON.stringify(cachedData));
    }

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
    const redisClient = await initializeRedisClient();
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post || post.deleted === true) {
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

    let isTitleUpdated = post.title !== req.body.title ? true : false;
    req.body.slug = slugify(req.body.title, { lower: true, trim: true });

    await Post.updateOne({ _id: id }, req.body);

    const cachedValue = await redisClient.get(
      `${process.env.CACHE_PREFIX}:post:${id}`,
    );
    const cachedPost = JSON.parse(cachedValue);
    cachedPost.title = req.body.title;
    cachedPost.content = req.body.content;
    cachedPost.tags = req.body.tags;
    cachedPost.slug = req.body.slug;
    cachedPost.images = req.body.images;

    await redisClient.setEx(
      `${process.env.CACHE_PREFIX}:post:${id}`,
      600,
      JSON.stringify(cachedPost),
    );

    if (isTitleUpdated) {
      const cachedAuthor = await redisClient.get(
        `${process.env.CACHE_PREFIX}:profile:${req.user.id}`,
      );
      if (cachedAuthor) {
        const cachedData = JSON.parse(cachedAuthor);
        const idx = cachedData.posts.findIndex(post => post._id === id);
        cachedData.posts[idx].title = req.body.title;

        await redisClient.setEx(
          `${process.env.CACHE_PREFIX}:profile:${req.user.id}`,
          600,
          JSON.stringify(cachedData),
        );
      }

      cachedPost.saves.forEach(async user => {
        const cachedSavedUser = await redisClient.get(
          `${process.env.CACHE_PREFIX}:profile:${user._id}`,
        );
        if (cachedSavedUser) {
          const cachedData = JSON.parse(cachedSavedUser);
          const idx = cachedData1.savedPosts.findIndex(post => post._id === id);
          cachedData.savedPosts[idx].title = req.body.title;

          await redisClient.setEx(
            `${process.env.CACHE_PREFIX}:profile:${user._id}`,
            600,
            JSON.stringify(cachedData),
          );
        }
      });
    }

    res.status(200).json({
      message: 'Update successfully!',
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// [DELETE] /api/v1/forum/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post || post.deleted === true) {
      res.status(404).json({
        message: 'Cannot find post!',
      });
      return;
    }

    if (post.userCreated._id.toString() !== req.user.id) {
      res.status(403).json({
        message: 'Only the author can delete post!',
      });
      return;
    }

    post.deleted = true;
    const savedPost = await post.save();

    await User.findByIdAndUpdate(req.user.id, { $pull: { posts: post._id } });

    await User.updateMany(
      { savedPosts: savedPost._id },
      { $pull: { savedPosts: savedPost._id } },
    );

    // Just update cache for author of post
    const redisClient = await initializeRedisClient();
    const cachedUser = await redisClient.get(
      `${process.env.CACHE_PREFIX}:profile:${req.user.id}`,
    );
    if (cachedUser) {
      const cachedData = JSON.parse(cachedUser);
      const idx = cachedData.posts.findIndex(post => post._id === id);
      if (idx > -1) {
        cachedData.posts.splice(idx, 1);
        await redisClient.setEx(
          `${process.env.CACHE_PREFIX}:profile:${req.user.id}`,
          600,
          JSON.stringify(cachedData),
        );
      }
    }

    // Delete cache for post
    await redisClient.del(`${process.env.CACHE_PREFIX}:post:${id}`);

    res.status(200).json({
      message: 'Delete successfully',
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// [PATCH] /api/v1/forum/change-status/:typeStatus/:id
module.exports.changeStatus = async (req, res) => {
  const id = req.params.id;
  const type = req.params.typeStatus;

  const post = await Post.findById(id);
  if (!post || post.deleted === true) {
    res.status(404).json({
      message: 'Cannot find post!',
    });
    return;
  }

  if (post.userCreated._id.toString() !== req.user.id) {
    res.status(403).json({
      message: 'Only the author can change status of post!',
    });
    return;
  }

  if (type !== 'public' && type !== 'private') {
    res.status(400).json({
      message: 'Invalid status type',
    });
    return;
  }

  if (post.status === type) {
    res.status(200).json({
      message: 'No update!',
    });
    return;
  }

  post.status = type;
  await post.save();

  const redisClient = await initializeRedisClient();
  const cachedPost = await redisClient.get(
    `${process.env.CACHE_PREFIX}:post:${id}`,
  );
  if (cachedPost) {
    const cachedData = JSON.parse(cachedPost);
    cachedData.status = type;
    await redisClient.setEx(
      `${process.env.CACHE_PREFIX}:post:${id}`,
      600,
      JSON.stringify(cachedData),
    );
  }

  res.status(200).json({
    message: 'Update successfully!',
  });
};
