import mongoose from 'mongoose';
import crypto from 'crypto';
import database from '../database';

const { Schema } = mongoose;

const userSchema = new Schema({
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

userSchema.methods.verify = (password) => {
  const encryptedPassword = crypto.createHmac('sha1', database.secret)
    .update(password).digest('base64');
  return this.password === encryptedPassword;
};

userSchema.methods.setAdmin = () => {
  this.admin = true;
  return this.save();
};

const User = mongoose.model('User', userSchema);
export default User;
