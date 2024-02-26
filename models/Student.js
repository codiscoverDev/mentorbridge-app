const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const StudentSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: [true, 'Please enter a roll no'],
    unique: [true, 'Please enter a password'],
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
});

// fire a function after a doc saved to db
StudentSchema.post('save', function (doc, next) {
  console.log('New user was created and Saved');
  next();
});

// fire a function before a doc saved to db
StudentSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  console.log('User is about to be created and saved');
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

const Student = mongoose.model('student', StudentSchema);
module.exports = Student;
