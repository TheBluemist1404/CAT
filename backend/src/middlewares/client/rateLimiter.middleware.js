const moment = require('moment');
const { initializeRedisClient } = require('../../utils/redis');

const WINDOW_SIZE_IN_MINUTES = 60;
const MAX_WINDOW_REQUEST_COUNT = 20;
const WINDOW_LOG_INTERVAL_IN_MINUTES = 10;

module.exports.redisRateLimiter = async (req, res, next) => {
  const redisClient = await initializeRedisClient();
  if (!redisClient) {
    res.status(500).json({
      message: 'Redis Client does not exist!',
    });
    return;
  }
  try {
    const record = await redisClient.get(
      `${process.env.CACHE_PREFIX}:rate-limit:${req.ip}`,
    );
    const currentReqTime = moment();

    if (!record) {
      const newRecord = [
        {
          requestTimestamp: currentReqTime.unix(),
          requestCount: 1,
        },
      ];

      await redisClient.setEx(
        `${process.env.CACHE_PREFIX}:rate-limit:${req.ip}`,
        WINDOW_SIZE_IN_MINUTES * 60,
        JSON.stringify(newRecord),
      );
      return next();
    }

    let data = JSON.parse(record);

    const windowStartTimestamp = moment()
      .subtract(WINDOW_SIZE_IN_MINUTES, 'minutes')
      .unix();

    const entriesWithinWindow = data.filter(
      entry => entry.requestTimestamp > windowStartTimestamp,
    );

    const totalReqCount = entriesWithinWindow.reduce(
      (acc, entry) => acc + entry.requestCount,
      0,
    );

    if (totalReqCount >= MAX_WINDOW_REQUEST_COUNT) {
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
    }

    const lastReqLog = entriesWithinWindow[entriesWithinWindow.length - 1];
    const potentialStartTimestamp = currentReqTime
      .subtract(WINDOW_LOG_INTERVAL_IN_MINUTES, 'minutes')
      .unix();

    if (lastReqLog && lastReqLog.requestTimestamp > potentialStartTimestamp) {
      lastReqLog.requestCount++;
    } else {
      entriesWithinWindow.push({
        requestTimestamp: currentReqTime.unix(),
        requestCount: 1,
      });
    }

    await redisClient.setEx(
      `${process.env.CACHE_PREFIX}:rate-limit:${req.ip}`,
      WINDOW_SIZE_IN_MINUTES * 60,
      JSON.stringify(entriesWithinWindow),
    );

    console.log('pass');
    next();
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
