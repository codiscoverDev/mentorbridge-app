const Student = require('../models/Student');

const getStudent = async (req, res) => {
  try {
    let student = await Student.getStudent(req.params);
    res.status(200).json({ success: true, student });
  } catch (err) {
    console.error(err);
    if (err.message === 'Student not found' || err.message === 'Please provide id or email or username') {
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
