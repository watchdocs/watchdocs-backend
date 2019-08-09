/* eslint-disable no-param-reassign */
/* eslint no-restricted-syntax: "off", guard-for-in: "off" */
import jwt from 'jsonwebtoken';

const util = {};

util.successTrue = data => ({
  success: true,
  message: null,
  error: null,
  data,
});

util.successFalse = (err, message) => {
  if (!(err || message)) {
    message = 'There is not any data';
  }
  return {
    success: false,
    message,
    error: err ? util.parseError(err) : null,
    data: null,
  };
};

util.parseError = (errors) => {
  const parsed = {};
  if (errors.name === 'ValidationError') {
    for (const name in errors.error) {
      const validationError = errors.error.name;
      parsed[name] = { message: validationError.message };
    }
  } else if (errors.code === '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message: 'This username already exists!' };
  } else {
    parsed.unhandled = errors;
  }
  return parsed;
};

util.isLoggedin = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.json(util.successFalse(null, 'token is required!'));

  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.json(util.successFalse(err));
    req.decoded = decoded;
    return next();
  });
};

module.exports = util;
