import express from 'express';

const router = express.Router();


// create users list
router.post('/', (req, res, next) => {
  res.send('respond with a resource');
});

// read user by user id
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

// read users list
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

// delete users list
router.delete('/', (req, res, next) => {
  res.send('respond with a resource');
});
