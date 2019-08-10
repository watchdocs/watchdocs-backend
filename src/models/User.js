import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
const passwordRegexErrorMessage = 'Password should be minimum 8 characters of alphabet and number combination.';

userSchema.path('password').validate(() => {
  const user = this;

  if (user.isNew) {
    if (!user.passwordConfirmation) {
      user.invalidate(
        'Successfully confirm password.',
        'Fail to confirm password.',
      );
    }
    if (!passwordRegex.test(user.password)) {
      user.invalidate('password', passwordRegexErrorMessage);
    } else if (user.password !== user.passwordConfirmation) {
      user.invalidate(
        'passwordConfirmation',
        'Fail to match password confirmation',
      );
    }
  }

  if (!user.isNew) {
    if (!user.currentPassword) {
      user.invalidate('currentPassword', 'Current Password is required!');
    }
    if (
      user.currentPassword
       && !bcrypt.compareSync(user.currentPassword, user.originalPassword)
    ) {
      user.invalidate('currentPassword', 'Current Password is invalid!');
    }
    if (user.newPassword && !passwordRegex.test(user.newPassword)) {
      user.invalidate('newPassword', passwordRegexErrorMessage);
    } else if (user.newPassword !== user.passwordConfirmation) {
      user.invalidate(
        'passwordConfirmation',
        'Password Confirmation does not matched!',
      );
    }
  }
});

// execute callback function before save event
userSchema.pre('save', (next) => {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  user.password = bcrypt.hashSync(user.password);
  return next();
});

userSchema.methods.verify = (password) => {
  const user = this;
  return bcrypt.compareSync(password, user.password);
};

userSchema.methods.setAdmin = () => {
  this.admin = true;
  return this.save();
};

const User = mongoose.model('User', userSchema);
export default User;
