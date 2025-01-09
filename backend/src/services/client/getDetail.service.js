const mongoose = require('mongoose');
const Post = require('../../models/client/post.model');
const User = require('../../models/client/user.model');
const Like = require('../../models/client/like.model');
const Comment = require('../../models/client/comment.model');
const Tag = require('../../models/client/tag.model');

const { initializeRedisClient } = require('../../utils/redis');

module.exports.getDetail = async id => {
  try {
    const redisClient = await initializeRedisClient();
    const cachedPost = await redisClient.get(
      `${process.env.CACHE_PREFIX}:post:${id}`,
    );
    if (cachedPost) {
      return [JSON.parse(cachedPost), true];
    }

    let postId = "" + id;
    const post = await Post.aggregate([
      {
        $match: {
          deleted: false,
          status: 'public',
          _id: new mongoose.Types.ObjectId(postId),
        },
      },
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
    console.log(post[0]);
    if (post.length > 0) return [post[0], false];
    return [null, false];
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};
