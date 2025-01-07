const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('error', err => {
  console.error('Redis error:', err);
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
