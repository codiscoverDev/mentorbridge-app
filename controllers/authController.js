const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// handle errors
const handleErrors = (err) => {
  // console.log(err.message, err.code);
  let message = '';

  // incorrect email
  if (err.message === 'incorrect email') {
    message = 'Email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    message = 'Password does not match';
  }

  // duplicate email error
  if (err.code === 11000) {
    message = 'Email has been already registered.';
  }

  // validation errors
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      message = properties.message;
    });
  }

  return message;
};

const maxAge = 3 * 24 * 60 * 60;

// create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

module.exports.student_signup = async (req, res) => {
  const { rollNo, name, email, password, phone, gender, year, branch, sec } =
    req.body;

  try {
    const student = await Student.create({
      rollNo,
      name,
      email,
      password,
      phone,
      gender,
      year,
      branch,
      sec,
    });
    const token = createToken(student._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ success: true, studentId: student._id, token });
  } catch (err) {
    const message = handleErrors(err);
    res.status(400).json({ success: false, message });
  }
};

module.exports.student_login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.login(email, password);
    const token = createToken(student._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ success: true, studentId: student._id, token });
  } catch (err) {
    const message = handleErrors(err);
    res.status(400).json({ success: false, message });
  }
};
module.exports.mentor_signup = async (req, res) => {
  const { name, email, password, phone, gender, department } = req.body;

  try {
    const mentor = await Mentor.create({
      name,
      email,
      password,
      phone,
      gender,
      department,
    });
    const token = createToken(mentor._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ success: true, mentorId: mentor._id, token });
  } catch (err) {
    const message = handleErrors(err);
    res.status(400).json({ success: false, message });
  }
};

module.exports.mentor_login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const mentor = await Mentor.login(email, password);
    const token = createToken(mentor._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ success: true, mentorId: mentor._id, token });
  } catch (err) {
    const message = handleErrors(err);
    res.status(400).json({ success: false, message });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
