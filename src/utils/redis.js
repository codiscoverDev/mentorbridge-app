const Redis = require('ioredis');
const { promisify } = require('util');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');
require('dotenv').config();
const { ENV, REDIS_URL } = process.env;

const TTL = 7200;

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

const flushAllCache = promisify(redis.flushall).bind(redis);

const clearCache = async (req, res) => {
  try {
    await flushAllCache();
    res.json({ success: true, message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Error while cleaning cache:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getCachedStudent = async (query) => {
  const cacheKey = `student:${JSON.stringify(query)}`;
  let cachedData = await redis.get(cacheKey);
  if (cachedData) {
    if (query.id) {
      return JSON.parse(cachedData);
    } else {
      cachedData = await redis.get(cachedData);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    }
  }
  const student = await Student.getStudent(query);
  const studentIdKey = `student:{"id":"${student.id}"}`;
  await redis.setex(studentIdKey, TTL, JSON.stringify(student));
  await redis.setex(`student:{"email":"${student.email}"}`, TTL, studentIdKey);
  await redis.setex(
    `student:{"username":"${student.username}"}`,
    TTL,
    studentIdKey
  );
  return student;
};
const getCachedMentor = async (query) => {
  const cacheKey = `mentor:${JSON.stringify(query)}`;
  let cachedData = await redis.get(cacheKey);
  if (cachedData) {
    if (query.id) {
      return JSON.parse(cachedData);
    } else {
      cachedData = await redis.get(cachedData);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    }
  }
  const mentor = await Mentor.getMentor(query);
  const mentorIdKey = `mentor:{"id":"${mentor.id}"}`;
  await redis.setex(mentorIdKey, TTL, JSON.stringify(mentor));
  await redis.setex(`mentor:{"email":"${mentor.email}"}`, TTL, mentorIdKey);
  await redis.setex(
    `mentor:{"username":"${mentor.username}"}`,
    TTL,
    mentorIdKey
  );
  return mentor;
};

module.exports = { redis, getCachedStudent, getCachedMentor, clearCache };
