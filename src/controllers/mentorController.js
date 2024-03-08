const Mentor = require('../models/Mentor');
const { promisify } = require('util');
const { redis, getCachedMentor } = require('../utils/redis');

const getMentor = async (req, res) => {
  try {
    let mentor = await getCachedMentor(req.query);
    res.setHeader('Cache-Control', 'private, max-age=60');
    res.status(200).json({ success: true, mentor });
  } catch (err) {
    if (
      err.message === 'Mentor not found' ||
      err.message === 'Please provide id or email or username'
    ) {
      res.status(404).json({
        success: false,
        message: err.message,
      });
    } else {
      console.error('Error while Mentor.getMentor: ', err.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
};

const updateMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, gender, department } = req.body;

    const mentor = await Mentor.findById(id);

    if (name) mentor.name = name;
    if (phone) mentor.phone = phone;
    if (gender) mentor.gender = gender;
    if (department) mentor.department = department;
    const updatedMentor = await mentor.save();
    const keys = [
      `mentor:{"id":"${updatedMentor.id}"}`,
      `mentor:{"email":"${updatedMentor.email}"}`,
      `mentor:{"username":"${updatedMentor.username}"}`,
    ];
    const delCache = promisify(redis.del).bind(redis);
    keys.forEach(async (key) => {
      await delCache(key);
    });

    res.status(200).json({ success: true, mentor: updatedMentor });
  } catch (error) {
    console.error('Error during mentor update: ', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const followMentor = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    // Update the mentor's following array with the mentorId
    await Mentor.findByIdAndUpdate(studentId, {
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

module.exports = { getMentor, updateMentor };
