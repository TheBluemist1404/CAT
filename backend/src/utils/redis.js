const redis = require('redis');

const redisClient = redis.createClient({
  socket: {
    host: "localhost"||"redis",  // redis is when running in docker
    port: 6379
  }
});

redisClient.on('error', err => {
  console.log('Redis error:', err);
});

module.exports.initializeRedisClient = async () => {
  if (redisClient.isOpen) {
    return redisClient;
  }
  
  await redisClient.connect();
  await redisClient.ping();
  console.log('Connected to Redis');

  return redisClient;
};
