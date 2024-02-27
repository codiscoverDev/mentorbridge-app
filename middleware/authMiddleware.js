const jwt = require('jsonwebtoken');
const User = require('../models/Student');
require('dotenv').config();

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exist & is verfied
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
      if (err) {
        res
          .status(401)
          .json({ success: false, message: 'Invalid token, Access denied' });
      } else {
        req.id = decodedToken.id;
        next();
      }
    });
  } else {
    res
      .status(401)
      .json({ success: false, message: 'Unauthorized, Token not provided' });
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
