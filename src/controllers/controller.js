import User from '../models/user';

exports.register = (req, res) => {
  const { userID, password } = req.body;
  let newUser = null;

  const create = (user) => {
    if (user) {
      throw new Error('userID already exists.');
    } else {
      return User.create(userID, password);
    }
  };

  const set = (count) => {
    if (count === 1) {
      return newUser.setAdmin();
    }
    return Promise.resolve(false);
  };

  const count = (user) => {
    newUser = user;
    return User.count();
  };

  const respond = (isAdmin) => {
    res.json({
      message: 'Successfully register!',
      admin: !!isAdmin,
    });
  };

  const anyError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  // check username duplication
  User.findUserByUserID(userID)
    .then(create)
    .then(set)
    .then(count)
    .then(respond)
    .catch(anyError);
};
