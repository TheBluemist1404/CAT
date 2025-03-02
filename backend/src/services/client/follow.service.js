const { default: mongoose, isValidObjectId } = require('mongoose');
const Follower = require('../../models/client/follower.model');

module.exports.checkFollowExist = async (followerId, followeeId) => {
  if (
    !mongoose.isValidObjectId(followerId) ||
    !mongoose.isValidObjectId(followeeId)
  ) {
    throw new Error('Invalid followerId or followeeId');
  }

  const foundFollow = await Follower.findOne({ followeeId, followerId });
  return foundFollow ? true : false;
};

module.exports.followUser = async (followerId, followeeId) => {
  const follow = new Follower({
    followeeId,
    followerId,
  });
  await follow.save();
};

module.exports.unfollowUser = async (followerId, followeeId) => {
  const deletedFollow = await Follower.findOneAndDelete({
    followeeId,
    followerId,
  });
  return deletedFollow ? true : false;
};

module.exports.getFollowers = async followeeId => {
  if (!mongoose.isValidObjectId(followeeId)) {
    throw new Error('Invalid followeeId');
  }

  const followers = await Follower.aggregate([
    { $match: { followeeId: new mongoose.Types.ObjectId('' + followeeId) } },
    {
      $lookup: {
        from: 'users',
        localField: 'followerId',
        foreignField: '_id',
        as: 'follower',
      },
    },
    {
      $unwind: '$follower', 
    },
    {
      $project: {
        _id: '$follower._id', 
        fullName: '$follower.fullName',
        avatar: '$follower.avatar',
        email: '$follower.email',
      },
    },
  ]);
  return followers;
};

module.exports.getFollowees = async (followerId) => {
  if (!mongoose.isValidObjectId(followerId)) {
    throw new Error('Invalid followerId');
  }

  const followees = await Follower.aggregate([
    { $match: { followerId: new mongoose.Types.ObjectId('' + followerId) } },
    {
      $lookup: {
        from: 'users',
        localField: 'followeeId',
        foreignField: '_id',
        as: 'followee',
      },
    },
    {
      $unwind: '$followee', 
    },
    {
      $project: {
        _id: '$followee._id', 
        fullName: '$followee.fullName',
        avatar: '$followee.avatar',
        email: '$followee.email',
      },
    },
  ]);
  return followees;
}
