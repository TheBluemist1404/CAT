const amqp = require('amqplib');
const Notification = require('../models/client/notification.model');
const Follower = require('../models/client/follower.model');
const { io, userSockets } = require('../sockets');

async function publishNotification(channel, queueName, type, senderId, recipientIds, message, extraData = {}) {
  const payload = {
    type,
    senderId,
    recipientIds,
    message,
    ...extraData, // Can include postId or projectId
  };

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });

  console.log('Message sent:', payload);
}

async function consumeNotification(channel, queueName) {
  console.log('Waiting for messages...');

  channel.consume(queueName, async msg => {
    if (msg !== null) {
      const { type, senderId, recipientIds, message, postId, projectId } = JSON.parse(msg.content.toString());
      
      const notifications = recipientIds.map(recipient => ({
        recipient,
        sender: senderId,
        type,
        post: postId || null,
        project: projectId || null,
        message,
      }));

      await Notification.insertMany(notifications);
      console.log('Notifications created:', notifications);

      recipientIds.forEach(recipient => {
        const recipientSocketId = userSockets.get(recipient);

        if (recipientSocketId) {
          io.to(recipientSocketId).emit('newNotification', {
            type,
            sender: senderId,
            post: postId || null,
            project: projectId || null,
            message,
          });
          console.log(`Notification sent to ${recipient}`);
        }
      });

      channel.ack(msg);
    }
  });
}

module.exports = { publishNotification, consumeNotification };
