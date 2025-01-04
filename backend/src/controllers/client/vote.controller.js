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
    const checkUpvoteExist = await Like.findOne({
      postId: post._id,
      userId: user._id,
    });

    switch (typeVote) {
      case 'upvote':
        if (!checkUpvoteExist) {
          const upvote = new Like({
            postId: post._id,
            userId: user._id,
            typeVote: 'upvote',
          });
          await upvote.save();
        } else {
          await Like.deleteOne({
            postId: post._id,
            userId: user._id,
          });
        }
        break;

      case 'downvote':
        if (!checkUpvoteExist) {
          const upvote = new Like({
            postId: post._id,
            userId: user._id,
            typeVote: 'downvote',
          });
          await upvote.save();
        } else {
          await Like.deleteOne({
            postId: post._id,
            userId: user._id,
          });
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
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
