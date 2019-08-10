import express from 'express';
import documentRouter from './document';
import searchRouter from './search';
import userRouter from './users';
import authRouter from './auth';

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); // 1
  next();
});
router.use('/documents', documentRouter);
router.use('/auth', authRouter);
router.use('/search', searchRouter);
router.use('/users', userRouter);

export default router;
