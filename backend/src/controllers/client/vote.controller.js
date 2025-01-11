const Post = require('../../models/client/post.model');
const User = require('../../models/client/user.model');
const Like = require('../../models/client/like.model');
const { initializeRedisClient } = require('../../utils/redis');

// [PATCH] /api/v1/forum/vote/:typeVote/:id
module.exports.vote = async (req, res) => {
  try {
    // console.log("this is vote api")
    const typeVote = req.params.typeVote;
    const id = req.params.id;
    const post = await Post.findById(id);
    const user = await User.findById(req.user.id);

    if (!post) {
      res.status(404).json({
        message: 'Cannot find post',
      });
      return;
    }
    const checkVoteExist = await Like.findOne({
      postId: post._id,
      userId: user._id,
    });

    switch (typeVote) {
      case 'upvote':
        if (checkVoteExist) {
          await Like.deleteMany({
            postId: post._id,
            userId: user._id,
          });
          if (checkVoteExist.typeVote === 'downvote') {
            const vote = new Like({
              postId: post._id,
              userId: user._id,
              typeVote: 'upvote',
            });
            await vote.save();
          }
        } else {
          const vote = new Like({
            postId: post._id,
            userId: user._id,
            typeVote: 'upvote',
          });
          await vote.save();
        }
        break;

      case 'downvote':
        if (checkVoteExist) {
          await Like.deleteMany({
            postId: post._id,
            userId: user._id,
          });
          if (checkVoteExist.typeVote === 'upvote') {
            const vote = new Like({
              postId: post._id,
              userId: user._id,
              typeVote: 'downvote',
            });
            await vote.save();
          }
        } else {
          const vote = new Like({
            postId: post._id,
            userId: user._id,
            typeVote: 'downvote',
          });
          await vote.save();
        }
        break;

      default:
        res.status(400).json({
          message: 'Invalid type vote',
        });
        return;
    }

    const totalVotes = await Like.aggregate([
      {
        $facet: {
          upvotesCount: [
            { $match: { typeVote: 'upvote', postId: post._id } },
            { $count: 'upvotes' },
          ],
          downvotesCount: [
            { $match: { typeVote: 'downvote', postId: post._id } },
            { $count: 'downvotes' },
          ],
        },
      },
    ]);

    const redisClient = await initializeRedisClient();
    const cachedPost = await redisClient.get(
      `${process.env.CACHE_PREFIX}:post:${id}`,
    );
    if (cachedPost) {
      const cachedData = JSON.parse(cachedPost);
      if (!checkVoteExist) {
        if (typeVote === 'upvote') {
          cachedData.upvotes.push({ userId: req.user.id });
        } else {
          cachedData.downvotes.push({ userId: req.user.id });
        }
      } else {
        if (checkVoteExist.typeVote === 'upvote') {
          cachedData.upvotes = cachedData.upvotes.filter(
            data => data.userId !== req.user.id,
          );
          if (typeVote === 'downvote') {
            cachedData.downvotes.push({ userId: req.user.id });
          }
        } else {
          cachedData.downvotes = cachedData.downvotes.filter(
            data => data.userId !== req.user.id,
          );
          if (typeVote === 'upvote') {
            cachedData.upvotes.push({ userId: req.user.id });
          }
        }
      }
      await redisClient.setEx(
        `${process.env.CACHE_PREFIX}:post:${id}`,
        600,
        JSON.stringify(cachedData),
      );
    }

    // console.log(typeVote)

    res.status(200).json({
      upvote:
        totalVotes[0].upvotesCount.length > 0
          ? totalVotes[0].upvotesCount[0].upvotes
          : 0,
      downvote:
        totalVotes[0].downvotesCount.length > 0
          ? totalVotes[0].downvotesCount[0].downvotes
          : 0,
      checkVoteExist,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
