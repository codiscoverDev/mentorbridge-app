const Redis = require('ioredis');
require('dotenv').config();

const { REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASS } = process.env;
let redis;
if (process.env.ENV === 'PROD') {
  redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    username: REDIS_USER,
    password: REDIS_PASS,
  });
} else {
  redis = new Redis();
}
redis.connect(() => console.log('Redis connected'));

module.exports = redis;
