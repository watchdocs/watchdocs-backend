import express from 'express';

const router = express.Router();
router.use('/user', userRouter);
router.use('/auth', authRouter);

export default router;
