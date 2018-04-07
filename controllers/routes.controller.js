const mongoose = require('mongoose');
const Route = require('../models/route.model');
const ApiError = require('../models/api-error.model');

module.exports.list = (req, res, next) => {
  Route.find()
    .then(routes => res.json(routes))
    .catch(error => next(error));
}

module.exports.listByLocation = (req, res, next) => {
    console.log("ASDF");
    const googleMapsClient = require('@google/maps').createClient({
        key: process.env.GOOGLE_MAPS,
        Promise: Promise
      });

    Route.find()
    .then(routes => {
        googleMapsClient.geocode({address: '1600 Amphitheatre Parkway, Mountain View, CA'})
        .asPromise()
        .then((response) => {
          console.log(response.json.results);
          res.json(response)
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(error => next(error));
    
      
      

  }

module.exports.get = (req, res, next) => {
  const id = req.params.id;
  Route.findById(id)
    .then(route => {
      if (route) {
        res.json(route)
      } else {
        next(new ApiError(`Route not found`, 404));
      }
    }).catch(error => next(error));
}

module.exports.create = (req, res, next) => {
  const route = new Route(req.body);
  /*
  if (req.file) {
    route.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  */
  route.save()
    .then(() => {
      res.status(201).json(route);
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
  Route.findByIdAndRemove(id)
    .then(route => {
      if (route) {
        res.status(204).json()
      } else {
        next(new ApiError(`Routes not found`, 404));
      }
    }).catch(error => next(error));
}

module.exports.edit = (req, res, next) => {
  const id = req.params.id;
  if (req.file) {
    body.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  
  Route.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then(route => {
      if (route) {
        res.json(route)
      } else {
        next(new ApiError(`Route not found`, 404));
      }
    }).catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new ApiError(error.message, 400, error.errors));
      } else {
        next(new ApiError(error.message, 500));
      }
    });
}