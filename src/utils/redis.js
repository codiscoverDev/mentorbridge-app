const Redis = require('ioredis');
require('dotenv').config();

// const { REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASS, ENV } = process.env;

// let redis;

// if (ENV === 'DEV') {
//   console.log('Running ==> ', ENV);
//   redis = new Redis({
//     host: REDIS_HOST,
//     port: REDIS_PORT,
//     username: REDIS_USER,
//     password: REDIS_PASS,
//     retryStrategy: (times) => Math.min(times * 50, 2000),
//   });

//   // Log when connected
//   redis.on('connect', () => {
//     console.log('Connected to Redis');
//   });
// } else {
//   redis = new Redis();
// }

// // Handle error events
// redis.on('error', (err) => {
//   console.error('Redis Error:', err.message);
// });

// // Handle reconnection
// redis.on('reconnecting', (delay, attempt) => {
//   console.log(`Reconnecting to Redis (attempt ${attempt})`);
// });

// // Log when connected in development environment
// if (ENV !== 'PROD') {
//   redis.on('connect', () => {
//     console.log('Connected to Redis');
//   });
// }
let redis;
try {
  redis = new Redis(process.env.REDIS_URL);
} catch (err) {
  console.error('Error in Redis connection:', err);
}

redis.on('connect', () => {
  console.log('Connected to Redis');
});

// Use "redis" instead of "renderRedis"
redis.set('animal', 'cat');

redis.get('animal').then((result) => {
  console.log('\nGET animal =======> ', result); // Prints "cat"
});
module.exports = redis;
