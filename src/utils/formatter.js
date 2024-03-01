const formatStudent = (student) => {
  let removeFields = [
    '_id',
    'password',
    'following',
    'verified',
    'createdAt',
    'updatedAt',
    '__v',
  ];
  for (const property of removeFields) delete student[property];
  return student;
};

module.exports = { formatStudent };
