const User = require('../../models/client/user.model');
const Post = require('../../models/client/post.model');
const slugify = require('slugify');
const hashPassword = require('../../utils/hashPassword');
const { getProfile } = require('../../services/client/getProfile.service');
const { initializeRedisClient } = require('../../utils/redis');
const { pickInfoData } = require('../../utils/getInfoData');

// [GET] /api/v1/profile/detail/:id
module.exports.index = async (req, res) => {
  try {
    const redisClient = await initializeRedisClient();

    const id = req.params.id;

    const [user, cacheHit] = await getProfile(id);

    if (!cacheHit) {
      await redisClient.setEx(
        `${process.env.CACHE_PREFIX}:profile:${id}`,
        600,
        JSON.stringify(user),
      );
    }

    if (user.isPrivate) {
      const data = pickInfoData(['_id', 'fullName', 'avatar','isPrivate'], user);
      res.status(200).json(data);
      return;
    }

    if (req.user && req.user.id !== id) {
      delete user['savedPosts'];
      user.posts = user.posts.filter(post => post.status === 'public');
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// [PATCH] /api/v1/profile/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        message: 'Cannot find user',
      });
      return;
    }
    if (user._id.toString() !== req.user.id) {
      res.status(403).json({
        message: 'Only the owner of the account can edit it!',
      });
      return;
    }

    req.body.slug = slugify(req.body.fullName, { trim: true, lower: true });
    req.body.password = user.password;
    await User.updateOne({ _id: id }, req.body);

    const redisClient = await initializeRedisClient();
    const cachedUser = await redisClient.get(
      `${process.env.CACHE_PREFIX}:profile:${id}`,
    );
    if (cachedUser) {
      const cachedData = JSON.parse(cachedUser);
      cachedData.fullName = req.body.fullName;
      cachedData.description = req.body.description;
      cachedData.schools = req.body.schools;
      cachedData.companies = req.body.companies;
      cachedData.avatar = req.body.avatar;
      


      

      await redisClient.setEx(
        `${process.env.CACHE_PREFIX}:profile:${id}`,
        600,
        JSON.stringify(cachedData),
      );
    }

    user.posts.forEach(async post => {
      const cachedPost = await redisClient.get(
        `${process.env.CACHE_PREFIX}:post:${post._id.toString()}`,
      );
      if (cachedPost) {
        const cachedData = JSON.parse(cachedPost);
        cachedData.userCreated.fullName = req.body.fullName;
        cachedData.userCreated.avatar = req.body.avatar;

        await redisClient.setEx(
          `${process.env.CACHE_PREFIX}:post:${post._id.toString()}`,
          600,
          JSON.stringify(cachedData),
        );
      }
    });

    res.status(200).json({
      message: 'Update successfully!',
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// [PATCH] /api/v1/profile/change-password/:id
module.exports.changePass = async (req, res) => {
  const id = req.params.id;
  const password = req.body.password;
  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({
      message: 'Cannot find user',
    });
    return;
  }
  if (req.user.id !== id) {
    res.status(403).json({
      message: 'Only the owner of the account can change the password!',
    });
    return;
  }
  user.password = await hashPassword.hash(password);
  await user.save();
  res.status(200).json({
    message: 'Change password successfully!',
  });
};

// [PATCH] /api/v1/profile/change-status/:id
module.exports.changeStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({
      message: 'Cannot find user',
    });
    return;
  }

  if (req.user.id !== id) {
    res.status(403).json({
      message: 'Access denied!',
    });
    return;
  }

  if (status !== 'private' && status !== 'public') {
    res.status(400).json({
      message: 'Invalid status!',
    });
    return;
  }

  if (status === 'private') {
    user.isPrivate = true;
  } else {
    user.isPrivate = false;
  }
  await user.save();

  const redisClient = await initializeRedisClient();
  const cachedUser = await redisClient.get(
    `${process.env.CACHE_PREFIX}:profile:${id}`,
  );
  if (cachedUser) {
    const cachedData = JSON.parse(cachedUser);
    cachedData.isPrivate = user.isPrivate;

    await redisClient.setEx(
      `${process.env.CACHE_PREFIX}:profile:${id}`,
      600,
      JSON.stringify(cachedData),
    );
  }

  res.status(200).json({
    message: 'Update status successfully!',
    userStatus: status,
  });
};
