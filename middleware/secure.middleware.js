const mongoose = require('mongoose');
const ApiError = require('../models/api-error.model');

module.exports.isAuthenticated = (req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        next();
    } else {
        next(new ApiError('Forbidden', 403));
    }
};

module.exports.isAuthor = (req, res, next) => {
    Recipe.findById(req.params.id).then((recipe) => {
        if( recipe.author.equals(req.user._id) ){
            next();
        } else {
            next(new ApiError('Forbidden', 403));
        }
      }); 
}