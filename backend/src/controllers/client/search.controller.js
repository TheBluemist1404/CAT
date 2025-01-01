const Post = require('../../models/client/post.model');
const Tag = require('../../models/client/tag.model');
const User = require('../../models/client/user.model');

// [GET] /api/v1/forum/search
module.exports.search = async (req, res) => {
  try {
    let type = req.query.type || 'posts';
    let q = req.query.q.trim();
    const qRegex = q.replace(/\s+/g, '-');
    let skip = parseInt(req.query.offset) || 0;
    let limit = parseInt(req.query.limit) || 10;

    switch (type) {
      case 'tags':
        const tag = await Tag.findOne({
          title: new RegExp(q, 'i'),
        });
        if (!tag) {
          res.status(404).json({
            message: 'Given tag does not exist!',
          });
          return;
        }
        const posts = await Post.find({
          status: 'public',
          deleted: false,
          tags: tag._id,
        })
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
            perDocumentLimit: 3,
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
            path: 'tags',
            select: '_id title',
          })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: 'desc' });

        for (const post of posts) {
          post.comments.forEach(comment => {
            if (comment.replies.length > 0) {
              comment.replies.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
              );
            }
          });
        }
        res.status(200).json(posts);
        break;

      case 'users':
        const users = await User.find({
          slug: new RegExp(qRegex, 'i'),
          deleted: false,
        });
        res.status(200).json(users);
        break;

      case 'posts':
        const searchPosts = await Post.find({
          slug: new RegExp(qRegex, 'i'),
          status: 'public',
          deleted: false,
        })
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
            perDocumentLimit: 3,
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
            path: 'tags',
            select: '_id title',
          })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: 'desc' });

        for (const post of searchPosts) {
          post.comments.forEach(comment => {
            if (comment.replies.length > 0) {
              comment.replies.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
              );
            }
          });
        }
        res.status(200).json(searchPosts);
        break;

      default:
        res.status(400).json({
          message: 'Invalid search type!',
        });
        return;
    }
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
