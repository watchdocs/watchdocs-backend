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
    error: err || null,
    data: null,
  };
};


util.isLoggedin = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.json(util.successFalse(null, 'token is required!'));

  return jwt.verify(token, 'hello', (err, decoded) => {
    if (err) return res.json(util.successFalse(err));
    req.decoded = decoded;
    return next();
  });
};

module.exports = util;
