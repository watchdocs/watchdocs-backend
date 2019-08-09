import express from 'express';
import documentRouter from './document';

const router = express.Router();
router.use('/document', documentRouter);
