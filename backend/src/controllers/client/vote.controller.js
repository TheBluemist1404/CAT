const Post = require('../../models/client/post.model');
const User = require('../../models/client/user.model');
const Like = require('../../models/client/like.model');

// [PATCH] /api/v1/forum/vote/:typeVote/:id
module.exports.vote = async (req, res) => {
  try {
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
          await Like.deleteOne({
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
          await Like.deleteOne({
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
    res.status(200).json({
      upvote: await Like.countDocuments({
        postId: post._id,
        typeVote: 'upvote',
      }),
      downvote: await Like.countDocuments({
        postId: post._id,
        typeVote: 'downvote',
      }),
      checkVoteExist,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
