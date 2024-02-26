const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const MentorSchema = new mongoose.Schema({
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
});

// fire a function after a doc saved to db
MentorSchema.post('save', function (doc, next) {
  console.log('New user was created and Saved');
  next();
});

// fire a function before a doc saved to db
MentorSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  console.log('User is about to be created and saved');
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

const Mentor = mongoose.model('mentor', MentorSchema);
module.exports = Mentor;
