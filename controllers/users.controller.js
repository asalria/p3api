const mongoose = require('mongoose');
const User = require('../models/user.model');
const ApiError = require('../models/api-error.model');

module.exports.list = (req, res, next) => {
  User.find()
    .then(user => {
      if (!user) {
        next(new ApiError('No users found', 400));
      } else {
        
            res.json(user);
      }    
    }).catch(error => next(new ApiError('No users found', 500)));
}

module.exports.listOne = (req, res, next) => {
  console.log(req.params);
  User.findById(req.params.id)
    .then(user => {
      console.log(user);
      if (!user) {
        next(new ApiError('No users found', 400));
      } else {
        
            res.json(user);
      }    
    }).catch(error => next(new ApiError('No users found', 500)));
}

module.exports.create = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        next(new ApiError('User already registered', 400));
      } else {
        user = new User(req.body);
        user.save()
          .then(() => {
            res.json(user);
          })
          .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
              next(new ApiError(error.message, 400, error.errors));
            } else {
              next(error);
            }
          });
      }
    }).catch(error => next(new ApiError('User already registered', 500)));
}

module.exports.edit = (req, res, next) => {
 // console.log(req.params.id);
  if (!req.body.password) {
    delete req.body.password;
    
  }
//console.log(req.body);
  User.findByIdAndUpdate(req.params.id, {$set: req.body})
    .then(user => {
      if (!user) {
        next(new ApiError('User does not exist', 400));
      } else {
            res.json(user);
      }
    }).catch(error => {
       console.log(error);
        next(new ApiError('User does not exist', 500))});
}