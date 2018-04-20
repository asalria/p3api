const mongoose = require('mongoose');
const moment = require('moment');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const Route = require('../models/route.model');
const ApiError = require('../models/api-error.model');

module.exports.list = (req, res, next) => {
  const query = {$or:[{sender: req.user.id},{receiver: req.user.id}]};
  Message.find(query)
      .populate('sender')
      .populate('receiver')
      .populate('route')
      .then(messages => {
        const formattedMessages = messages.map(message => (
          {
              id: message.id,
              message: message.message,
              sender: message.sender,
              receiver: message.receiver,
              route: message.route,
              created: 	moment(message.created).format('LLL')
          }
      ));
      res.json(formattedMessages);
      })
    .catch(error => next(error));
}

module.exports.get = (req, res, next) => {
  const id = req.params.id;
  Message.findById(id)
    .then(message => {
      if (message) {
        const formattedMessages = messages.map(message => (
          {
              id: message.id,
              message: message.message,
              sender: message.sender,
              receiver: message.receiver,
              route: message.route,
              created: 	moment(message.created).format('LLL')
          }
      ));
      res.json(formattedMessages);
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