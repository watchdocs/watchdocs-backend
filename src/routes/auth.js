import express from 'express';
import jwt from 'jsonwebtoken';
import util from '../util';
import User from '../models/User';

const router = express.router();

// login
router.post('/login', (req, res, next) => {
  let isValid = true;
  const validationError = {
    name: 'ValidationError',
    errors: {},
  };

  if (!req.body.username) {
    isValid = false;
    validationError.errors.username = {
      message: 'Username is required!',
    };
  }
  if (!req.body.password) {
    isValid = false;
    validationError.errors.password = { message: 'Password is required!' };
  }

  if (!isValid) return res.json(util.successFalse(validationError));
  return next();
},

(req, res) => {
  User.findOne({ username: req.body.username })
    .select({
      password: 1, username: 1, name: 1, email: 1,
    })
    .exec((err, user) => {
      if (err) return res.json(util.successFalse(err));
      if (!user || !user.authenticate(req.body.password)) {
        return res.json(util.successFalse(null, 'Username or Password is invalid'));
      }

      const payload = {
        _id: user._id,
        username: user.username,
      };
      const secretOrPrivateKey = process.env.JWT_SECRET;
      const options = { expiresIn: 60 * 60 * 24 };
      return jwt.sign(payload, secretOrPrivateKey, options, (er, token) => {
        if (er) return res.json(util.successFalse(err));
        return res.json(util.successTrue(token));
      });
    });
});

// me
router.get('/me', util.isLoggedin,
  (req, res) => {
    User.findById(req.decoded._id)
      .exec((err, user) => {
        if (err || !user) return res.json(util.successFalse(err));
        return res.json(util.successTrue(user));
      });
  });

// refresh
router.get('/refresh', util.isLoggedin,
  (req, res) => {
    User.findById(req.decoded._id)
      .exec((err, user) => {
        if (err || !user) return res.json(util.successFalse(err));

        const payload = {
          _id: user._id,
          username: user.username,
        };
        const secretOrPrivateKey = process.env.JWT_SECRET;
        const options = { expiresIn: 60 * 60 * 24 };
        return jwt.sign(payload, secretOrPrivateKey, options, (er, token) => {
          if (er) return res.json(util.successFalse(err));
          return res.json(util.successTrue(token));
        });
      });
  });

module.exports = router;
