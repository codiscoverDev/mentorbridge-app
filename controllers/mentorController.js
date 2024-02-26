const Mentor = require('../models/Mentor');
const Student = require('../models/Student');

const searchMentors = async (req, res) => {
  try {
    const { name } = req.params;

    // Using a regular expression for a case-insensitive search
    const mentors = await Mentor.find({
      name: { $regex: new RegExp(name, 'i') },
    });

    res.json({
      success: true,
      message: 'Mentors found successfully',
      data: mentors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
// Controller function to follow a mentor

const followMentor = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    // Update the student's following array with the mentorId
    await Student.findByIdAndUpdate(studentId, {
      $addToSet: { following: mentorId },
    });

    res.json({
      success: true,
      message: 'Mentor followed successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getMentorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the mentor by ID
    const mentor = await Mentor.findById(id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found',
      });
    }

    res.json({
      success: true,
      message: 'Mentor found successfully',
      data: mentor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = { searchMentors, followMentor, getMentorById };
