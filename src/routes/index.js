import express from 'express';
import documentRouter from './document';
import auth from './userAuth';
import search from './search';
import users from './users';

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded( {extended : false } ));

router.use('/document', documentRouter);

router.use('/auth', auth);
router.use('/search', search);
router.use('/users', users);

export default router;
