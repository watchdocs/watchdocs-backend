import User from '../models/User';

export default function (userID) {
  return (req, res, next) => {
    User.find({ userID }).then((err, user) => {
      if (err) return;
      const isAdmin = user.trusted_ip.find(req._decoded.user.department);
      if (isAdmin) next();
    });
  };
}
