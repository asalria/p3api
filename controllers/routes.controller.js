const mongoose = require('mongoose');
const Route = require('../models/route.model');
const User = require('../models/user.model');
const ApiError = require('../models/api-error.model');

module.exports.list = (req, res, next) => {
  Route.find()
    .then(routes => {
      res.json(routes)
    })
    .catch(error => next(error));
}

module.exports.listByLocation = (req, res, next) => {
    const googleMapsClient = require('@google/maps').createClient({
        key: process.env.GOOGLE_MAPS,
        Promise: Promise
      });
      var limit = req.query.limit || 10;

      // get the max distance or set it to 8 kilometers
      var maxDistance = req.query.distance || 8;
  
      // we need to convert the distance to radians
      // the raduis of Earth is approximately 6371 kilometers
      maxDistance /= 6371;
    
    Route.find()
    .then(routes => {
        googleMapsClient.geocode({address: req.params.search})
        .asPromise()
        .then((response) => {
          console.log(response.json.results[0]);
          var coords = [];
         coords[0] = response.json.results[0].geometry.location.lat;
        coords[1] = response.json.results[0].geometry.location.lng;
        Route.find({startPoint: {
          $near: {
              $geometry:{ 
                  type: "Point", 
                  coordinates: coords
              }
          }
      }}).limit(limit).exec(function(err, locations) {
        if (err) {
          console.log(err);
            return res.json(500, err);
        }
        console.log(locations);
        res.json(200, locations);
    });
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
        User.findById(route.owner)
    .then(user => {
      if (user) {
       route['owner'] = user.nick;
        console.log(route['owner']);
        route2 = {
          title : route['title'],
          owner : route['owner'],
          description : route['description'],
          duration : route['duration'],
          price : route['price'],
          img : route['img'],
          transport: route['transport'],
          rating: route['rating'],
          startPoint: route['startPoint'],
          endPoint: route['endPoint'],
          ownername: user.nick
        }
        res.json(route2);
      } else {
        next(new ApiError(`User not found`, 404));
      }
    }).catch(error => next(error));
       
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
        console.log(error);
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