const followService = require('../../services/client/follow.service');

// [POST] /api/v1/users/follows
module.exports.followUser = async (req, res) => {
  try {
    const followeeId = req.body.id;
    const followerId = req.user.id;

    const foundFollow = await followService.checkFollowExist(
      followerId,
      followeeId,
    );
    if (foundFollow) {
      res.status(204).json({
        message: 'Already follow user!',
      });
      return;
    }

    await followService.followUser(followerId, followeeId);

    res.status(201).json({
      message: 'Follow successfully!',
      followeeId,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// [DELETE] /api/v1/users/follows
module.exports.unfollowUser = async (req, res) => {
  try {
    const followeeId = req.body.id;
    const followerId = req.user.id;

    const isDeleted = await followService.unfollowUser(followerId, followeeId);
    if (!isDeleted) {
      res.status(400).json({
        message: 'Invalid followee id!',
      });
      return;
    }

    res.status(200).json({
      message: 'Unollow successfully!',
      followeeId,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// [GET] /api/v1/users/:id/followers
module.exports.getFollowers = async (req, res) => {
  try {
    const followeeId = req.params.id;

    const followers = await followService.getFollowers(followeeId);
    res.status(200).json(followers);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// [GET] /api/v1/users/followees
module.exports.getFollowees = async (req, res) => {
  try {
    const followerId = req.user.id;

    const followees = await followService.getFollowees(followerId);
    res.status(200).json(followees);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};