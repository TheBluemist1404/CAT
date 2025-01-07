const Post = require('../../models/client/post.model');
const User = require('../../models/client/user.model');
const Like = require('../../models/client/like.model');
const Comment = require('../../models/client/comment.model');
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

      return [post, false];
  } catch (err) {
    console.log(err);
  }
};
