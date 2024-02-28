const Redis = require('ioredis');
require('dotenv').config();
const { ENV, REDIS_URL } = process.env;

let redis;
if (ENV === 'PROD') {
  redis = new Redis(REDIS_URL, {
    connectionName: 'mentorbridge-cache',
    maxRetriesPerRequest: 5,
    connectTimeout: 5000,
  });
} else {
  redis = new Redis();
}
redis.on('connect', () => {
  console.log('Connected to Redis');
});

// Handle error events
redis.on('error', (err) => {
  console.error('Redis Error:', err.message);
});

// Handle reconnection
redis.on('reconnecting', (delay, attempt) => {
  console.log(`Reconnecting to Redis... [Attempt: ${attempt}]`);
});

module.exports = redis;
