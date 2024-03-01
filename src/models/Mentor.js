const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const { formatStudent } = require('../utils/formatter');

const MentorSchema = new mongoose.Schema(
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
          'Invalid username. Use only letters, numbers, and underscores.',
      },
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
    department: {
      type: String,
      required: [true, 'Please enter department'],
    },
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

// fire a function after a doc saved to db
// MentorSchema.post('save', function (doc, next) {
//   console.log('New user was created and Saved');
//   next();
// });

// fire a function before a doc saved to db
MentorSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.error('Error before saving mentor data: ', err.message);
  }
  // console.log('User is about to be created and saved');
  next();
});

// static method to login user
MentorSchema.statics.login = async function (email, password) {
  const mentor = await this.findOne({ email });
  if (mentor) {
    const auth = await bcrypt.compare(password, mentor.password);
    if (auth) {
      return mentor;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

MentorSchema.statics.getMentor = async function (body) {
  const { id, email, username } = body;
  let mentor;
  if (id) {
    mentor = await Mentor.findById(id);
  } else if (email) {
    mentor = await Mentor.findOne({ email });
  } else if (username) {
    mentor = await Mentor.findOne({ username });
  }
  if (mentor) {
    return mentor.toJSON();
  }
  throw Error('Mentor not found');
};

const Mentor = mongoose.model('mentor', MentorSchema);
module.exports = Mentor;
