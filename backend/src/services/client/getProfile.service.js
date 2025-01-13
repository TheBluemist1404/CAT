const mongoose = require('mongoose');
const User = require('../../models/client/user.model');
const Post = require('../../models/client/post.model');
const { initializeRedisClient } = require('../../utils/redis');

module.exports.getProfile = async id => {
  try {
    const redisClient = await initializeRedisClient();
    const cachedProfile = await redisClient.get(
      `${process.env.CACHE_PREFIX}:profile:${id}`,
    );

    if (cachedProfile) {
      return [JSON.parse(cachedProfile), true];
    }

    const userId = '' + id;
    const user = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'userCreated',
          as: 'posts',
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'savedPosts',
          foreignField: '_id',
          as: 'savedPosts',
        },
      },
      {
        $addFields: {
          posts: {
            $filter: {
              input: '$posts',
              as: 'post',
              cond: { $eq: ['$$post.deleted', false] },
            },
          },
          savedPosts: {
            $filter: {
              input: '$savedPosts',
              as: 'savedPost',
              cond: {
                $and: [
                  { $eq: ['$$savedPost.deleted', false] },
                  { $eq: ['$$savedPost.status', 'public'] },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          '_id': 1,
          'fullName': 1,
          'description': 1,
          'schools': 1,
          'companies': 1,
          'email': 1,
          'avatar': 1,
          'posts._id': 1,
          'posts.title': 1,
          'posts.createdAt': 1,
          'posts.status': 1,
          'savedPosts._id': 1,
          'savedPosts.title': 1,
          'savedPosts.createdAt': 1,
        },
      },
    ]);
    if (user.length > 0) return [user[0], false];
    return [null, false];
  } catch (err) {
    console.log(err);
  }
};
