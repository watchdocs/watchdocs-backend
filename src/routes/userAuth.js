import express from 'express';
import controller from '../controllers/controller';

const router = express.Router();

router.post('/register', controller.register);
module.exports = router;
