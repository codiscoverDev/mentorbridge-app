const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  // console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors['email'] = 'Email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors['password'] = 'Password does not match';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors['email'] = 'Email has been already registered.';
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;

// create token
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja pro max', {
    expiresIn: maxAge,
  });
};

module.exports.student_signup = async (req, res) => {
  const { rollNo, name, email, password, phone, gender, year, branch, sec } =
    req.body;

  console.log('roll: ', rollNo);

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
    res.status(201).json({ student: student._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.student_login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.login(email, password);
    const token = createToken(student._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ student: student._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
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
    res.status(201).json({ mentor: mentor._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.mentor_login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const mentor = await Mentor.login(email, password);
    const token = createToken(mentor._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ mentor: mentor._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
