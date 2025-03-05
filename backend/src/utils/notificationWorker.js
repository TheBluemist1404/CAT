const amqp = require('amqplib');
const Notification = require('../models/client/notification.model');
const Follower = require('../models/client/follower.model');
const { io, userSockets } = require('../sockets');

async function publishNotification(channel, queueName, post, user) {
  const message = {
    senderId: post.userCreated,
    postId: post._id,
    userInfo: user,
  };

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log('Message sent:', message);
}

async function consumeNotification(channel, queueName) {
  console.log('Waiting for messages...');

  channel.consume(queueName, async msg => {
    if (msg !== null) {
      const { senderId, postId, userInfo } = JSON.parse(msg.content.toString());

      const followers = await Follower.find({ followeeId: senderId });

      const notifications = followers.map(follower => ({
        recipient: follower.followerId.toString(),
        sender: senderId,
        post: postId,
        message: `${userInfo.fullName} has just created a post`,
      }));

      await Notification.insertMany(notifications);
      console.log('Notifications created:', notifications);

      followers.forEach(follower => {
        const recipientSocketId = userSockets.get(follower.followerId.toString());

        if (recipientSocketId) {
          io.to(recipientSocketId).emit('newNotification', {
            sender: senderId,
            post: postId,
            message: `${userInfo.fullName} has just created a post`,
          });
          console.log(`Notification sent to ${follower.followerId}`);
        }
      });

      channel.ack(msg);
    }
  });
}

module.exports = { publishNotification, consumeNotification };
