import express from 'express';
import multer from 'multer';
import md5File from 'md5-file';
import axios from 'axios';
import Document from '../models/Document';
import userRole from '../middleware/userRole';

const documentRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

documentRouter.post('/', upload.single('document'), (req, res) => {
  let txID = '';
  axios.post('https://baas-test.wiccdev.org/v2/api/contract/callcontracttx', {
    amount: 0,
    arguments: '316173646661736466617364',
    calleraddress: 'wdLtg6peTqYUtHJmmZPLuFFncSqG6D7LBY',
    fee: 0,
    regid: '1107463-1',
  },
  {
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => {
      txID = response.body.data.hash || '';
    })
    .catch((error) => {
      console.log(error);
    });
  Document.create({
    name: req.body.name,
    author: req.body.author,
    hash: md5File.sync(req.file.path),
    txid: txID,
  }, (err, row) => {
    if (err) return res.json('error');
    return res.json(row);
  });
});

documentRouter.get('/', (req, res) => Document.find().then(docs => res.json(docs)));
documentRouter.get('/:id', userRole, (req, res) => Document.findById(req.params.id).then(docs => res.json(docs)));
documentRouter.put('/:id', upload.single('document'), userRole, (req, res) => {
  let txID = '';
  axios.post('https://baas-test.wiccdev.org/v2/api/contract/callcontracttx', {
    amount: 0,
    arguments: '316173646661736466617364',
    calleraddress: 'wdLtg6peTqYUtHJmmZPLuFFncSqG6D7LBY',
    fee: 0,
    regid: '1107463-1',
  },
  {
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => {
      txID = response.body.data.hash || '';
    })
    .catch((error) => {
      console.log(error);
    });
  Document.updateOne({ id: req.params.id }, {
    name: req.body.name,
    author: req.body.author,
    hash: md5File.sync(req.file.path),
    txid: txID,
  })
    .then(docs => res.json(docs));
});

documentRouter.delete('/:id', userRole, (req, res) => {
  Document.deleteOne({ id: req.params.id }).then(() => res.status(200).end());
});

documentRouter.put('/:id/department', userRole, (req, res) => {
  const { id } = req.params;
  const { department } = req.body;
  if (department !== null) {
    Document.updateOne({ id }, { $push: { department } }).then(() => res.status(200).end());
  } else {
    res.status(401).end();
  }
});

documentRouter.delete('/:id/department', userRole, (req, res) => {
  const { id } = req.params;
  const { department } = req.body;
  if (department !== null) {
    Document.updateOne({ id }, { $pull: { department } }).then(() => res.status(200).end());
  } else {
    res.status(401).end();
  }
});

documentRouter.put('/:id/position', userRole, (req, res) => {
  const { id } = req.params;
  const { position } = req.body;
  if (position !== null) {
    Document.updateOne({ id }, { $push: { position } }).then(() => res.status(200).end());
  } else {
    res.status(401).end();
  }
});

documentRouter.delete('/:id/position', userRole, (req, res) => {
  const { id } = req.params;
  const { position } = req.body;
  if (position !== null) {
    Document.updateOne({ id }, { $pull: { position } }).then(() => res.status(200).end());
  } else {
    res.status(401).end();
  }
});

export default documentRouter;
