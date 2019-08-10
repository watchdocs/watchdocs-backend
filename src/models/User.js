import mongoose from 'mongoose';

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
  email: {
    type: String,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Should be a vaild email address!'],
    trim: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', userSchema);
export default User;
