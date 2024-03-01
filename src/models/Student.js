const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const { formatStudent } = require('../utils/formatter');

const StudentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Please enter a username'],
      minlength: 3,
      maxlength: 20,
      validate: {
        validator: (value) => /^[a-zA-Z0-9_]+$/.test(value),
        message:
          'Invalid characters in username. Use only letters, numbers, and underscores.',
      },
    },
    rollNo: {
      type: String,
      required: [true, 'Please enter a roll no'],
    },
    name: {
      type: String,
      required: [true, 'Please enter name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: [true, 'Please enter unique email'],
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: 6,
    },
    phone: {
      type: Number,
      required: [true, 'Please enter phone no'],
      unique: [true, 'Please enter unique phone'],
    },
    gender: {
      type: String,
      required: [true, 'Please enter gender'],
    },
    year: {
      type: String,
      required: [true, 'Please enter year'],
    },
    branch: {
      type: String,
      required: [true, 'Please enter branch'],
    },
    sec: {
      type: String,
      required: [true, 'Please enter name'],
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor',
      },
    ],
    verified: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        formatStudent(ret);
      },
    },
  }
);

// StudentSchema.set('toJSON', {
//   transform: function (doc, ret) {
//     ret.id = ret._id;
//     delete ret._id;
//     delete ret.__v;
//   },
// });

// fire a function after a doc saved to db
// StudentSchema.post('save', function (doc, next) {
//   // console.log('New user was created and Saved');
//   next();
// });

// fire a function before a doc saved to db
StudentSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.error('Error before saving student data: ', err);
  }
  // console.log('User is about to be created and saved');
  next();
});

// static method to login user
StudentSchema.statics.login = async function (email, password) {
  const student = await this.findOne({ email });
  if (student) {
    const auth = await bcrypt.compare(password, student.password);
    if (auth) {
      return student;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

StudentSchema.statics.getStudent = async function (body) {
  const { id, email, username } = body;
  let student;
  if (id) {
    student = await Student.findById(id);
  } else if (email) {
    student = await Student.findOne({ email });
  } else if (username) {
    student = await Student.findOne({ username });
  }
  if (student) {
    return student.toJSON();
  }
  throw Error('Student not found');
};

const Student = mongoose.model('student', StudentSchema);
module.exports = Student;
