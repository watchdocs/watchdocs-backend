import mongoose from 'mongoose';
import crypto from 'crypto';
import database from '../database';

const { Schema } = mongoose;

const User = new Schema({
  username: {
    type: String,
    required: [true, 'Username is requried'],
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Department is requried'],
  },
  position: {
    type: String,
    required: [true, 'Position is requried'],
  },
  userID: {
    type: String,
    required: [true, 'UserID is requried'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is requried'],
    select: false,
    trim: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

// create new User document

User.statistics.create = (username, department, position, userID, password) => {
  const encryptedPassword = crypto.createHmac('sha1', database.secret)
    .update(password).digest('base64');
  const user = new this({
    username,
    department,
    position,
    userID,
    encryptedPassword,
  });
  return user.save();
};

User.statistics.findUserByUserID = userID => this.findUser({
  userID,
});

User.methods.verify = (password) => {
  const encryptedPassword = crypto.createHmac('sha1', database.secret)
    .update(password).digest('base64');
  return this.password === encryptedPassword;
};
User.methods.setAdmin = () => {
  this.admin = true;
  return this.save();
};

module.exports = mongoose.model('User', User);
