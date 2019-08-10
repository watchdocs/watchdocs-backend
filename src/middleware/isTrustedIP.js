import User from '../models/User';

export default function (userID) {
  return (req, res, next) => {
    User.find({ userID }).then((err, row) => {
      if (err) return;
      const isDefined = row.trusted_ip.find(req.connection.remoteAddress);
      if (isDefined) {
        next();
      }
    });
  };
}
