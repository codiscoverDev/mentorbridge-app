const mongoose = require('mongoose');

const DoubtRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter name'],
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentor',
      required: true,
    },
    mentorName: {
      type: String,
      required: [true, 'Please enter Mentor name'],
    },
    topics: {
      type: [String],
      required: [
        true,
        'At least one topic is required at the time of creation',
      ],
    },
    subject: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    enrolledStudentsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    enrollmentDeadline: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    scheduledTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware to increment enrollmentCount when a student enrolls
// DoubtRoomSchema.pre('findOneAndUpdate', async function (next) {
//   try {
//     await this.findOneAndUpdate({}, { $inc: { enrollmentCount: 1 } }).exec();
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const DoubtRoom = mongoose.model('doubtroom', DoubtRoomSchema);
module.exports = DoubtRoom;

// Explanation:
// - `mentorId`: References the 'Mentor' collection using the mentor's ObjectId.
// - `topics`: An array of strings, at least one is required at the time of creation.
// - `enrolledStudentsId`: An array of ObjectIds referencing the 'Student' collection.
// - `modifiedAt`: Defaults to the current date and time when the document is created.
// - `timestamps: true`: Automatically adds 'createdAt' and 'updatedAt' fields to the schema.
// - `enrollmentCount`: Defaults to 0 and is automatically incremented when students enroll.

/*

Explanation:
- `enrollmentCount`: Defaults to 0.
- Middleware using `pre('findOneAndUpdate', ...)`: This middleware runs before each update operation.
- `$inc: { enrollmentCount: 1 }`: This MongoDB update op
*/
