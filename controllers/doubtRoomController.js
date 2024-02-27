const DoubtRoom = require('../models/DoubtRoom');

const createDoubtRoom = async (req, res) => {
  try {
    // Destructuring fields from req.body
    const {
      name,
      mentorId,
      mentorName,
      topics,
      subject,
      isActive,
      enrolledStudentsId,
      enrollmentCount,
      enrollmentDeadline,
      venue,
      scheduledTime,
    } = req.body;

    // Use the DoubtRoom model to create a new doubt room
    // Assuming DoubtRoom is your Mongoose model for doubt rooms
    const newDoubtRoom = await DoubtRoom.create({
      name,
      mentorId,
      mentorName,
      topics,
      subject,
      isActive,
      enrolledStudentsId,
      enrollmentCount,
      enrollmentDeadline: new Date(enrollmentDeadline), // Convert to Date object
      venue,
      scheduledTime: new Date(scheduledTime), // Convert to Date object
    });

    res.json({
      success: true,
      message: 'Doubt room created successfully',
      data: newDoubtRoom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
const enrollStudent = async (req, res) => {
  try {
    const { studentId, doubtRoomId } = req.body;

    // Use $addToSet to add studentId to the enrolledStudentsId array and get the updated document
    const updatedDoubtRoom = await DoubtRoom.findByIdAndUpdate(
      doubtRoomId,
      {
        $addToSet: { enrolledStudentsId: studentId },
        $inc: { enrollmentCount: 1 },
      },
      { new: true } // Return the updated document
    );

    if (!updatedDoubtRoom) {
      return res.status(404).json({
        success: false,
        message: 'Doubt room not found',
      });
    }

    res.json({
      success: true,
      message: 'Student enrolled successfully',
      data: updatedDoubtRoom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


module.exports = { createDoubtRoom, enrollStudent };
