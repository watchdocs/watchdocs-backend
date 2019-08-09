/*
 user is given token when verified
*/
import jwt from 'jsonwebtoken';
import User from '../models/User';

exports.login = (req, res) => {
  const { username, password } = req.body;
  const secret = req.app.get('jwt-secret');

  const check = (user) => {
    if (!user) {
      throw new Error('login failed');
    } else if (user.verify(password)) {
      const promise = new Promise((resolve, reject) => {
        jwt.sign(
          {
            _id: user._id,
            userID: user.userID,
            admin: user.admin,
          },
          secret,
          {
            issuer: 'velopert.com',
            expireIn: '7d',
            subject: 'userInfo',
          }, (token, err) => {
            if (err) {
              reject(err);
            }
            resolve(token);
          },
        );
      });
      return promise;
    } else {
      throw new Error('login failed');
    }
  };
  const respond = (token) => {
    res.json({
      msg: 'Successfully log in.',
      token,
    });
  };

  const anyError = (error) => {
    res.status(403).json({
      msg: error.msg,
    });
  };

  User.findUserByUserID(username)
    .then(check)
    .then(respond)
    .catch(anyError);
};
