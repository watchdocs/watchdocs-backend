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

/*
send token to server
server check token to verify the user
*/

exports.check = (req, res) => {
  const token = req.headers['x-access-token'] || req.query.token;

  if (!token) {
    return res.status(403).json({
      success: false,
      msg: 'fail to log in.',
    });
  }

  const respond = (data) => {
    res.json({
      success: true,
      info: data,
    });
  };

  const promise = new Promise(
    (resolve, reject) => {
      jwt.verify(token, req.app.get('jwt-secret', (decodedPassword, err) => {
        if (err) {
          reject(err);
        }
        resolve(decodedPassword);
      }));
    },
  );

  const anyError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  };

  promise.then(respond(token)).catch(anyError);
  return 0;
};
