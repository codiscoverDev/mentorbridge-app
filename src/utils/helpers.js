const Student = require('../models/Student');

const generateUsername = async (name, email) => {
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
  const baseName = name.toLowerCase().replace(/\s+/g, '_');
  let username = email
    .split('@')[0]
    .replace(/-/g, '_')
    .replace(/[^\w-]+/g, '');
  if (username.length > 12) {
    username = username.slice(0, 12);
  }
  let isUnique = false;
  let i = -1;
  while (!isUnique) {
    const existingUser = await Student.findOne({ username });
    if (!existingUser) {
      isUnique = true;
    } else {
      if (i === -1) {
        username = baseName;
        if (baseName.length > 12) {
          username = baseName.slice(0, 12);
        }
      }
      if (i > 22) {
        username = baseName.slice(0, 6) + Math.floor(Math.random() * 10000);
      }
      if (i % 2 === 0) {
        username = baseName + suffix[i];
      } else {
        username = name.split(' ')[0] + suffix[i];
      }
      i++;
    }
  }
  return username;
};

module.exports = { generateUsername };
