import express from 'express';

const router = express.Router();
router.use('/user', userRouter);
router.use('/song', songRouter);
router.use('/auth', authRouter);

export default router;