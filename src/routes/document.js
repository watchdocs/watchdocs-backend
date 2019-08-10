import express from 'express';
import multer from 'multer';
import md5File from 'md5-file';
import axios from 'axios';
import Document from '../models/Document';
import userRole from '../middleware/userRole';
import ContractHelper from '../utils/ContractHelper';

const documentRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

documentRouter.post('/', upload.single('document'), (req, res) => {
  Document.create({
    name: req.body.name,
    author: req.body.author,
    hash: md5File.sync(req.file.path),
  }, async (err, row) => {
    if (err) return res.json('error');
    const txID = await ContractHelper.documentSave(row._id, row.hash);
    return Document.findOneAndUpdate({ _id: row._id }, { txid: txID })
      .then(rows => res.json(rows))
      .catch(error => res.json(error));
  });
});

documentRouter.get('/', (req, res) => Document.find().then(docs => res.json(docs)));
documentRouter.get('/:id', userRole, (req, res) => Document.findById(req.params.id).then(docs => res.json(docs)));
documentRouter.put('/:id', upload.single('document'), userRole, (req, res) => {
  Document.findOne({ id: req.params.id }, (err, row) => {
    const hash = md5File.sync(req.file.path);
    const txID = ContractHelper.documentSave(row._id, hash);
    return Document.findOneAndUpdate({ _id: row._id }, {
      name: req.body.name,
      author: req.body.author,
      hash,
      txid: txID,
    });
  }).then(docs => res.json(docs));
});

documentRouter.delete('/:id', userRole, (req, res) => {
  Document.deleteOne({ _id: req.params.id }).then(() => res.status(200).end());
});

documentRouter.put('/:id/department', userRole, (req, res) => {
  const { id } = req.params;
  const { department } = req.body;
  if (department !== null) {
    Document.updateOne({ _id: id }, { $push: { department } }).then(() => res.status(200).end());
  } else {
    res.status(401).end();
  }
});

documentRouter.delete('/:id/department', userRole, (req, res) => {
  const { id } = req.params;
  const { department } = req.body;
  if (department !== null) {
    Document.updateOne({ _id: id }, { $pull: { department } }).then(() => res.status(200).end());
  } else {
    res.status(401).end();
  }
});

documentRouter.put('/:id/position', userRole, (req, res) => {
  const { id } = req.params;
  const { position } = req.body;
  if (position !== null) {
    Document.updateOne({ _id: id }, { $push: { position } }).then(() => res.status(200).end());
  } else {
    res.status(401).end();
  }
});

documentRouter.delete('/:id/position', userRole, (req, res) => {
  const { id } = req.params;
  const { position } = req.body;
  if (position !== null) {
    Document.updateOne({ _id: id }, { $pull: { position } }).then(() => res.status(200).end());
  } else {
    res.status(401).end();
  }
});

export default documentRouter;
