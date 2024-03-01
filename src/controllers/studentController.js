const Student = require('../models/Student');

const getStudent = async (req, res) => {
  try {
    let student = await Student.getStudent(req.body);
    res.status(200).json({ success: true, student });
  } catch (err) {
    if (err.message === 'Student not found') {
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

module.exports = { getStudent };
