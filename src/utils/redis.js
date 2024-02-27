const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();
client.get = promisify(client.get).bind(client);
client.setEx = promisify(client.setEx).bind(client);

module.exports = client;
