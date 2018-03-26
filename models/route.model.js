const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const routeSchema = new mongoose.Schema({
   owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
   },
   description: {
       type: String,
       required: ['true','A description of the route is required']
   },
   duration: {
       type: Date
   },
   price: {
       type: Number
   },
   pic: {
       type: String
   },
   transport: {
       type: String
   },
   rating: {
       type: Number
   },
   start: [{
       type: String  
   }],
   end: [{
       type:String
   }]

});

const Route = mongoose.model('Route', routeSchema);

module.exports = Router;