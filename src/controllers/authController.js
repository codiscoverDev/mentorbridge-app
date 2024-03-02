const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const sendMail = require('../services/mailService');
const { generateUsername } = require('../utils/helpers');
const { redis } = require('../utils/redis');
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

  // duplicate email, phone, username error
  if (err.code === 11000) {
    if (err.keyPattern.email) {
      message = 'Email has been already registered';
    } else if (err.keyPattern.phone) {
      message = 'Phone number has been already registered';
    } else if (err.keyPattern.username) {
      message = 'Username is not available';
    }
  }
  if (!message) {
    if (
      err.message.includes('student validation failed') ||
      err.message.includes('mentor validation failed')
    ) {
      message = 'Please enter ';
      Object.values(err.errors).forEach(({ properties }) => {
        if (properties.message) message += properties.message + ', ';
      });
      message = message.slice(0, message.lastIndexOf(', '));
    }
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
    const username = await generateUsername(name, email);
    const student = await Student.create({
      username,
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
    if (!message) {
      console.error('Error while student signup: ', err.message);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    } else {
      res.status(400).json({ success: false, message });
    }
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
    if (!message) {
      console.error('Error while student login: ', err.message);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    } else {
      res.status(400).json({ success: false, message });
    }
  }
};
const mentor_signup = async (req, res) => {
  const { name, email, password, phone, gender, department } = req.body;

  try {
    const username = await generateUsername(name, email);
    const mentor = await Mentor.create({
      username,
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
    if (!message) {
      console.error('Error while mentor signup: ', err.message);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    } else {
      res.status(400).json({ success: false, message });
    }
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
    if (!message) {
      console.error('Error while mentor login: ', err.message);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    } else {
      res.status(400).json({ success: false, message });
    }
  }
};

const generate_OTP = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpAge = Date.now() + 10 * 60 * 1000; // 10 minutes
  try {
    await redis.set(`otp:${email}`, otp, 'EX', 600);
    await redis.set(`otp:expire:${email}`, otpAge, 'EX', 600);

    const mailSent = await sendMail(email, otp, 'verifyOTP');

    if (mailSent) {
      res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } else {
      throw new Error('Error sending OTP');
    }
  } catch (err) {
    console.error('Error in generate_OTP:', err.message);
    res
      .status(500)
      .json({ success: false, message: 'Internal server error error' });
  }
};

const verify_email = async (req, res) => {
  const { email, userOTP, userType } = req.body;

  try {
    const otp = await redis.get(`otp:${email}`);
    const otpAge = await redis.get(`otp:expire:${email}`);

    if (userOTP === otp && Date.now() < otpAge) {
      if (userType === 'student')
        await Student.updateOne({ email: email }, { $set: { verified: true } });
      if (userType === 'mentor')
        await Mentor.updateOne({ email: email }, { $set: { verified: true } });
      console.log('Email marked as verified for a user:', userType);
      const mailSent = await sendMail(email, otp, 'OTPConfirmation');

      if (mailSent) {
        console.log('OTP Confirmation email sent successfully');
      } else {
        console.error('OTP Confirmation email not sent');
      }
      res
        .status(200)
        .json({ success: true, message: 'Email verified successfully' });
    } else {
      res
        .status(401)
        .json({ success: false, message: 'Invalid or expired OTP' });
    }
  } catch (err) {
    console.error('Error in verify_email:', err.message);
    res
      .status(500)
      .json({ success: false, message: 'Internal server error error' });
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
