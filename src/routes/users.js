import express from 'express';
import User from '../models/user';

const router = express.Router();

router.get('/:id/trust', (req, res) => {
  const { id } = req.params;
  User.findOne({ id })
    .then(user => res.json(user.trusted_ip));
});

router.post('/:id/trust', (req, res) => {
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

router.delete('/:id/trust', (req, res) => {
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

export default router;
