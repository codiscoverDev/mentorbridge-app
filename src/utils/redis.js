const Redis = require('ioredis');
require('dotenv').config();

const connectToRedis = async () => {
  try {
    const redis = new Redis(process.env.REDIS_URL, {
      connectionName: 'mentorbridge-cache',
      maxRetriesPerRequest: 5,
      connectTimeout: 5000,
    });

    redis.on('connect', () => {
      console.log('Connected to Redis');
    });

    redis.on('error', (err) => {
      console.error('Redis Error:', err.message);
      throw err;
    });

    return redis;
  } catch (err) {
    console.error('Error in Redis connection:', err);
    throw err;
  }
};
let redis;
(async () => {
  redis = await connectToRedis();
})();

module.exports = async () => {
  if (!redis) {
    console.warn(
      'Redis instance not yet connected. Please wait for initialization.'
    );
  }
  return redis;
};
