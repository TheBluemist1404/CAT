const moment = require('moment');
const redis = require('redis');

const redisClient = redis.createClient();
redisClient.on('error', err => console.log('Redis Client Error', err));

const WINDOW_SIZE_IN_MINUTES = 60;
const MAX_WINDOW_REQUEST_COUNT = 20;
const WINDOW_LOG_INTERVAL_IN_MINUTES = 10;

module.exports.redisRateLimiter = async (req, res, next) => {
  await redisClient.connect();
  try {
    if (!redisClient) {
      throw new Error('Redis Client does not exist!');
      process.exit(1);
    }
    const record = await redisClient.get(`rate-limit:${req.ip}`);
    const currentReqTime = moment();
    if (!record) {
      let newRecord = [];
      let reqLog = {
        requestTimestamp: currentReqTime.unix(),
        requestCount: 1,
      };
      newRecord.push(reqLog);

      await redisClient.setEx(
        `rate-limit:${req.ip}`,
        7200,
        JSON.stringify(newRecord),
      );
      next();
    }
    let data = JSON.parse(record);
    let windowStartTimestamp = currentReqTime
      .subtract(WINDOW_LOG_INTERVAL_IN_MINUTES, 'minutes')
      .unix();
    let entriesWithinWindow = data.filter(entry => {
      return entry.requestTimestamp > windowStartTimestamp;
    });

    let totalReqCount = entriesWithinWindow.reduce((acc, entry) => {
      acc += entry.requestCount;
    }, 0);

    if (totalReqCount > MAX_WINDOW_REQUEST_COUNT) {
      const firstRequestTimestamp = entriesWithinWindow[0].requestTimestamp;
      const retryAfterSeconds = Math.max(
        0,
        WINDOW_SIZE_IN_MINUTES * 60 -
          (currentReqTime.unix() - firstRequestTimestamp),
      );

      res.setHeader('Retry-After', retryAfterSeconds);
      res.status(429).json({
        message: `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_MINUTES} minutes limit!`,
      });
      return;
    } else {
      let lastReqLog = data[data.length - 1];
      if (lastReqLog.requestTimestamp > windowStartTimestamp) {
        lastReqLog.requestCount++;
        data[data.length - 1] = lastReqLog;
      } else {
        data.push({
          requestTimestamp: currentReqTime.unix(),
          requestCount: 1,
        });
      }
    }

    await redisClient.setEx(`rate-limit:${req.ip}`, 7200, JSON.stringify(data));
    next();
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
