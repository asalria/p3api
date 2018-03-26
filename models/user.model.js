const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
  nick: {
    type: String,
    required: [true, 'Nick is required']
  },
  about: {

  },
  name: {
    type: String
  },
  phone: {
    type: String,
    match: ['[0-6]{6,}','Please fill a phone number with more than 6 characters']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  birthdate: {
    type: Date
  },
  sex: {
    type: String
  },
  preferences: {
    type: String
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'User needs a password']
  }
},
{ 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR)
    .then(salt => {
      bcrypt.hash(user.password, salt)
        .then(hash => {
          user.password = hash;
          return next();
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;