const amqp = require('amqplib');

async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
  return connection;
}

async function createChannel(connection, queueName) {
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  return channel;
}

module.exports = { connectRabbitMQ, createChannel };
