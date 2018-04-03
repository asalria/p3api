const mongoose = require('mongoose');
const Message = require('../models/message.model');
const ApiError = require('../models/api-error.model');

module.exports.list = (req, res, next) => {
  Message.find()
    .then(messages => res.json(messages))
    .catch(error => next(error));
}

module.exports.get = (req, res, next) => {
  const id = req.params.id;
  Message.findById(id)
    .then(message => {
      if (message) {
        res.json(message)
      } else {
        next(new ApiError(`Message not found`, 404));
      }
    }).catch(error => next(error));
}

module.exports.create = (req, res, next) => {
  
  const message = new Message(req.body);
  console.log(message);
  message.save()
    .then(() => {
      res.status(201).json(message);
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new ApiError(error.errors));
      } else {
        next(new ApiError(error.message, 500));
      }
    })
}

module.exports.delete = (req, res, next) => {
  const id = req.params.id;
  Message.findByIdAndRemove(id)
    .then(message => {
      if (message) {
        res.status(204).json()
      } else {
        next(new ApiError(`Message not found`, 404));
      }
    }).catch(error => next(error));
}

module.exports.edit = (req, res, next) => {
  const id = req.params.id;
  if (req.file) {
    body.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  
  Message.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then(message => {
      if (message) {
        res.json(message)
      } else {
        next(new ApiError(`Message not found`, 404));
      }
    }).catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new ApiError(error.message, 400, error.errors));
      } else {
        next(new ApiError(error.message, 500));
      }
    });
}