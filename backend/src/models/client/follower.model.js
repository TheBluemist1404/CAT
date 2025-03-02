const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema(
  {
    followeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

followerSchema.index({ followeeId: 1, followerId: 1 }, { unique: true });
followerSchema.index({ followeeId: 1 });
followerSchema.index({ followerId: 1 });

const Follower = mongoose.model('Follower', followerSchema);
module.exports = Follower;
