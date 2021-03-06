import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import util from '../util';
import User from '../models/User';

const authRouter = express.Router();

// login
authRouter.post('/login', (req, res) => {
  User.findOne({ userID: req.body.userID })
    .select({
      password: 1, userID: 1, username: 1, email: 1,
    })
    .exec((err, user) => {
      if (!user) {
        return res.json(util.successFalse(null, 'UserID is invalid'));
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.json(util.successFalse(null, 'UserID or Password is invalid'));
      }

      const payload = {
        _id: user._id,
        userID: user.userID,
      };
      const options = { expiresIn: 60 * 60 * 24 };
      return jwt.sign(payload, 'hello', options, (er, token) => {
        if (er) return res.json(util.successFalse(er));
        return res.json(util.successTrue([token, user.userID]));
      });
    });
});

// me
authRouter.get('/me', util.isLoggedin,
  (req, res) => {
    User.findById(req.decoded._id)
      .exec((err, user) => {
        if (err || !user) return res.json(util.successFalse(err));
        return res.json(util.successTrue(user));
      });
  });

// refresh
authRouter.get('/refresh', util.isLoggedin,
  (req, res) => {
    User.findById(req.decoded._id)
      .exec((err, user) => {
        if (err || !user) return res.json(util.successFalse(err));

        const payload = {
          _id: user._id,
          userID: user.userID,
        };
        const options = { expiresIn: 60 * 60 * 24 };
        return jwt.sign(payload, 'hello', options, (er, token) => {
          if (er) return res.json(util.successFalse(err));
          return res.json(util.successTrue(token));
        });
      });
  });

export default authRouter;
