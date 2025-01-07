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

    const user = await User.findById(id)
      .populate({
        path: 'posts',
        match: { deleted: false },
        select: '_id title createdAt images',
      })
      .populate({
        path: 'savedPosts',
        match: { deleted: false },
        select: '_id title createdAt',
      })
      .lean();

    return [user, false];
  } catch (err) {
    console.log(err);
  }
};
