import express from 'express';
import Document from '../models/Document';

const searchRouter = express.Router();

searchRouter.get('/', (req, res) => {
  Document.find({ name: new RegExp(req.body.query, 'i') })
    .then(docs => res.json(docs));
});

export default searchRouter;
