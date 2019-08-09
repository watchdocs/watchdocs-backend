import express from 'express';
import documentRouter from './document';
import auth from './userAuth';
import search from './search';
import users from './users';

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); // 1
  next();
});
router.use('/document', documentRouter);

router.use('/auth', auth);
router.use('/search', search);
router.use('/users', users);

export default router;
