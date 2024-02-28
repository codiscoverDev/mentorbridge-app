const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const sendMail = require('../services/mailService');
const redis = require('../utils/redis');
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

const student_signup = async (req, res) => {
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
      verified: false,
    });
    const token = createToken(student._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ success: true, studentId: student._id, token });
  } catch (err) {
    const message = handleErrors(err);
    res.status(400).json({ success: false, message });
  }
};

const student_login = async (req, res) => {
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
const mentor_signup = async (req, res) => {
  const { name, email, password, phone, gender, department } = req.body;

  try {
    const mentor = await Mentor.create({
      name,
      email,
      password,
      phone,
      gender,
      department,
      verified: false,
    });
    const token = createToken(mentor._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ success: true, mentorId: mentor._id, token });
  } catch (err) {
    const message = handleErrors(err);
    res.status(400).json({ success: false, message });
  }
};

const mentor_login = async (req, res) => {
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

const generate_OTP = async (req, res) => {
  const { userId, email } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpAge = Date.now() + 10 * 60 * 1000; // 10 minutes

    await redis.set(`otp:${userId}`, otp, 'EX', 600);
    await redis.set(`otp:expire:${userId}`, otpAge, 'EX', 600);

    const mailSent = await sendMail(email, otp);

    if (mailSent) {
      res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } else {
      throw new Error('Error sending OTP');
    }
  } catch (error) {
    console.error('Error in generate_OTP:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const verify_email = async (req, res) => {
  const { userId, userOTP } = req.body;

  try {
    const otp = await redis.get(`otp:${userId}`);
    const otpAge = await redis.get(`otp:expire:${userId}`);

    if (userOTP === otp && Date.now() < otpAge) {
      await User.updateOne({ _id: userId }, { $set: { verified: true } });
      console.log('Email marked as verified for user:', userId);
      res.status(200).json({ message: 'Email verified successfully' });
    } else {
      res.status(401).json({ message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error('Error in verify_email:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  student_signup,
  student_login,
  mentor_signup,
  mentor_login,
  generate_OTP,
  verify_email,
};
