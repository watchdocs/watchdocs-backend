import express from 'express';
import multer from 'multer';
import md5File from 'md5-file';
import Document from '../models/Document';
import ContractHelper from '../utils/ContractHelper';

const documentRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

documentRouter.post('/documents', upload.single('document'), (req, res) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  Document.create({
    data: text,
    name: req.body.name,
    author: req.body.author,
    hash: md5File.sync(req.file.path),
  }, (async (err, row) => {
    if (err) return res.json(err);
    const txID = await ContractHelper.documentSave(row._id, row.data);
    return Document.updateOne({ _id: row._id }, { txid: txID }, (error, document) => {
      if (error) return res.json(error);
      return res.json(document);
    });
  }));
});

documentRouter.get('/documents', (req, res) => Document.find().then(docs => res.json(docs)));

documentRouter.get('/documents/:id', (req, res) => Document.find({ id: req.params.id }).then(docs => res.json(docs)));

documentRouter.put('/documents/:id', upload.single('document'), (req, res) => {
  const { name, author } = req.body;
  Document.updateOne({ _id: req.params.id }, {
    name,
    author,
    hash: md5File.sync(req.file.path),
  }).then((err, row) => {
    const txID = ContractHelper.documentSave(row._id, row.hash);
    Document.updateOne({ _id: row._id }, { txid: txID }, (error, document) => {
      if (error) return res.json(error);
      return res.json(document);
    });
  });
});

documentRouter.delete('/documents/:id', (req, res) => {
  Document.deleteOne({ id: req.params.id }, (err, row) => {
    if (err) return res.json(err);
    return res.json(row);
  });
});


export default documentRouter;
