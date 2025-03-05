const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {
  connectRabbitMQ,
  createChannel,
} = require('./utils/rabbitmqConnection');
const database = require('./config/database');
const { consumeNotification } = require('./utils/notificationWorker');
const http = require('http');
const { io } = require('./sockets');


const NOTIFICATION_QUEUE = 'notification';

async function bootstrap() {
  database.connect();

  const app = express();

  const port = process.env.PORT;
  const router = require('./routes/client/index.route');

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());

  const server = http.createServer(app);
  io.attach(server);

  const rabbitMQConnection = await connectRabbitMQ();
  const notificationProducer = await createChannel(
    rabbitMQConnection,
    NOTIFICATION_QUEUE,
  );
  const notificationConsumer = await createChannel(
    rabbitMQConnection,
    NOTIFICATION_QUEUE,
  );

  global.notificationProducer = notificationProducer;
  global.notificationConsumer = notificationConsumer;

  consumeNotification(notificationConsumer, NOTIFICATION_QUEUE);

  router(app);

  server.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}

bootstrap();
