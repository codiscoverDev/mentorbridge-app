const Student = require('../models/Student');
const { promisify } = require('util');
const { redis, getCachedStudent } = require('../utils/redis');

const getStudent = async (req, res) => {
  try {
    let student = await getCachedStudent(req.query);
    res.setHeader('Cache-Control', 'private, max-age=60');
    res.status(200).json({ success: true, student });
  } catch (err) {
    if (
      err.message === 'Student not found' ||
      err.message === 'Please provide id or email or username'
    ) {
      res.status(404).json({
        success: false,
        message: err.message,
      });
    } else {
      console.error('Error while Student.getStudent: ', err.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { rollNo, name, phone, gender, year, branch, sec } = req.body;

    // Find the student by ID
    const student = await Student.findById(id);

    // Update fields only if valid values are provided in req.body
    if (rollNo) student.rollNo = rollNo;
    if (name) student.name = name;
    if (phone) student.phone = phone;
    if (gender) student.gender = gender;
    if (year) student.year = year;
    if (branch) student.branch = branch;
    if (sec) student.sec = sec;

    // Save the updated student
    const updatedStudent = await student.save();
    const keys = [
      `student:{"id":"${updatedStudent.id}"}`,
      `student:{"email":"${updatedStudent.email}"}`,
      `student:{"username":"${updatedStudent.username}"}`,
    ];
    const delCache = promisify(redis.del).bind(redis);
    keys.forEach(async (key) => {
      await delCache(key);
    });

    // Respond with the updated student data
    res.status(200).json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error('Error during student update: ', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getStudent, updateStudent };
