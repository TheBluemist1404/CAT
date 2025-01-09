const Post = require('../../models/client/post.model');
const Tag = require('../../models/client/tag.model');
const User = require('../../models/client/user.model');
const Comment = require('../../models/client/comment.model');
const Like = require('../../models/client/like.model');
const unidecode = require('unidecode');

// [GET] /api/v1/forum/search
module.exports.search = async (req, res) => {
  try {
    let type = req.query.type || 'posts';

    let q = unidecode(req.query.q.trim());
    const qRegex = q.replace(/\s+/g, '-');

    let skip = parseInt(req.query.offset) || 0;
    let limit = parseInt(req.query.limit) || 10;

    switch (type) {
      case 'tags':
        const tag = await Tag.findOne({
          title: q.toLowerCase(),
        });
        if (!tag) {
          res.status(404).json({
            message: 'Given tag does not exist!',
          });
          return;
        }

        const posts = await Post.aggregate([
          {
            $match: {
              deleted: false,
              status: 'public',
              tags: tag._id,
            },
          },
          { $sort: { createdAt: -1 } },
          {
            $facet: {
              metadata: [{ $count: 'total' }],
              posts: [
                { $skip: skip },
                { $limit: limit },
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
                      { $limit: 3 },
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
              ],
            },
          },
        ]);

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
        const searchPosts = await Post.aggregate([
          {
            $match: {
              deleted: false,
              status: 'public',
              slug: new RegExp(qRegex, 'i'),
            },
          },
          { $sort: { createdAt: -1 } },
          {
            $facet: {
              metadata: [{ $count: 'total' }],
              posts: [
                { $skip: skip },
                { $limit: limit },
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
                      { $limit: 3 },
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
              ],
            },
          },
        ]);
        
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
