import User from '../models/User';

export default function () {
  return (req, res, next) => {
    const user = User.find({ userID: req.User.userID });
    if (user) {
      next();
    }
    return 0;
  };
}
