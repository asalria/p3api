const mongoose = require('mongoose');
const ApiError = require('../models/api-error.model');
const Route = require('../models/route.model');


module.exports.isAuthenticated = (req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        next();
    } else {
        next(new ApiError('Forbidden', 403));
    }
};

module.exports.isAuthor = (req, res, next) => {
    Route.findById(req.params.id).then((route) => {
        if( route.owner.id.equals(req.user._id) ){
            next();
        } else {
            next(new ApiError('Forbidden', 403));
        }
      }); 
}