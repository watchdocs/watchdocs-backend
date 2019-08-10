/* eslint-disable no-param-reassign */
/* eslint no-restricted-syntax: "off", guard-for-in: "off" */

import express from 'express';
import User from '../models/User';
import util from '../util';
import bcrypt from 'bcrypt';

const userRouter = express.Router();

// create user account
userRouter.post('/', (req, res) => {
  const {
    username, department, position, userID, email, admin,
  } = req.body;
  const password = bcrypt.hashSync(req.body.password, 10);

  const newUser = new User({
    username, department, position, userID, password, email, admin,
  });
  newUser.save((err, user) => {
    if (err) return res.json(err);
    return res.json(user);
  });
});

// read a user by userID
userRouter.get('/:id/trust', (req, res) => {
  const { id } = req.params;
  User.findOne({ id })
    .then(user => res.json(user.trusted_ip));
});

// show list of users
userRouter.get('/', util.isLoggedin, (req, res) => {
  User.find({})
    .sort({ userID: 1 })
    .exec((err, userlist) => {
      res.json(err || !userlist ? util.successFalse(err) : util.successTrue(userlist));
    });
});

// register adequate ip
userRouter.post('/:id/trust', (req, res) => {
  const { id } = req.params;
  const { ip } = req.body;
  const regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
  if (regex.test(ip)) {
    User.updateOne({ id }, { $push: { trusted_ip: ip } })
      .then(() => res.status(200).end());
  } else {
    res.status(401).end();
  }
});

// user-defined function for update and delete
function checkPermission(req, res, next) {
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err || !user) return res.json(util.successFalse(err));
    if (!req.decoded || user._id !== req.decoded._id) {
      return res.json(util.successFalse(null, 'Disapproval to access'));
    }
    return next();
  });
}

// update
userRouter.put('/:username', util.isLoggedin, checkPermission, (req, res) => {
  User.findOne({ username: req.params.username })
    .select({ password: 1 })
    .exec((err, user) => {
      if (err || !user) return res.json(util.successFalse(err));

      // update user object
      user.originalPassword = user.password;
      user.password = req.body.newPassword ? req.body.newPassword : user.password;
      for (const p in req.body) {
        user[p] = req.body[p];
      }

      // save user object
      return user.save((er, row) => {
        if (er || !row) return res.json(util.successFalse(er));

        row.password = '123456';
        return res.json(util.successTrue(row));
      });
    });
});

// delete ip
userRouter.delete('/:id/trust', (req, res) => {
  const { id } = req.params;
  const { ip } = req.body;
  const regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
  if (regex.test(ip)) {
    User.updateOne({ id }, { $pull: { trusted_ip: ip } })
      .then(() => res.status(200).end());
  } else {
    res.status(401).end();
  }
});

// delete user
userRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  User.findOneAndRemove({ userID: id }
    .exec((err, user) => {
      res.json((err || !user) ? util.successFalse(err) : util.successTrue(user));
    }));
});

export default userRouter;
