import express from 'express';
import Document from '../models/Document';
import userRole from '../middleware/userRole';

const router = express.Router();

router.get('/', (req, res) => {
  Document.find({ name: new RegExp(req.body.query, 'i') })
    .then(docs => res.json(docs));
});

export default router;
