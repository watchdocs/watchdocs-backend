import express from 'express';
import userAuth from './userAuth';
import userAuthController from '../controllers/userAuthController';

const router = express.Router();
router.post('/userAuth', userAuth);
router.post('/login', userAuthController.register);
router.get('/check', userAuthController.check);

export default router;
