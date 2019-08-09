import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.query.token;

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'fail to log in',
    });
  }

  const promise = new Promise((resolve, reject) => {
    jwt.verify(token, req.app.get('jwt-secret'), (err, decodedpassword) => {
      if (err) reject(err);
      resolve(decodedpassword);
    });
  });

  const anyError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  };

  promise.then((decodedpassword) => {
    req.decoded = decodedpassword;
    next();
  }).catch(anyError);
};

module.exports = authMiddleware;
