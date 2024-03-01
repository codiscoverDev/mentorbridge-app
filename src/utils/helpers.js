const Student = require('../models/Student');

const generateUsername = async (name, email) => {
  const minLen = 3;
  const maxLen = 20;
  const suffix = [
    '_',
    '_official',
    '01',
    '_active',
    '101',
    '_dreamer',
    '11',
    '_tech',
    '21',
    '_happy',
    '99',
    '_fun',
    '999',
    '_digital',
    '50',
    '_curious',
    '09',
    '_mindful',
    '111',
    '_official',
    '123',
    '_active',
    '029',
    '_dreamer',
  ];
  const baseName = name.replace(/\s+/g, '_');
  let username = email
    .split('@')[0]
    .replace(/-/g, '_')
    .replace(/[^\w-]+/g, '');
  let isUnique = false;
  let i = -1;
  while (!isUnique) {
    username = username.toLowerCase();
    const existingUser = await Student.findOne({ username });
    if (!existingUser) {
      isUnique = true;
    } else {
      if (i === -1) {
        username = baseName;
      }
      if (i > 22) {
        username =
          baseName.slice(0, maxLen - 6) + Math.floor(Math.random() * 10000);
      }
      if (i % 2 === 0) {
        username = baseName + suffix[i];
      } else if (i > 0) {
        username = name.split(' ')[0] + suffix[i];
      }
      i++;
    }
  }
  if (username.length > maxLen) {
    username = username.slice(0, maxLen);
  } else if (username.length < minLen) {
    username += Math.floor(Math.random() * 10000);
  }
  username = username.toLowerCase();
  return username;
};

module.exports = { generateUsername };
