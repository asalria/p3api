const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const routeSchema = new mongoose.Schema({
   title: {
       type: String,
       required: ['Give a name to your route']
   },
   owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
   },
   description: {
       type: String,
       required: ['true','A description of the route is required']
   },
   duration: {
       type: String
   },
   price: {
       type: Number
   },
   img: {
       type: String
   },
   transport: {
       type: String
   },
   rating: {
       type: Number
   },
   startPoint: {
    type: Object,
    properties: {
      type: {
        type: String,
        enum: 'Point',
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }},
    endPoint: {
        type: Object,
        properties: {
          type: {
            type: String,
            enum: 'Point',
            default: 'Point'
          },
          coordinates: {
            type: [Number],
            default: [0, 0]
          }
        }
    }
});

routeSchema.pre('save', function save(next) {
    console.log(this.startPoint[0]);
    const route = this;
    route.startPoint = {
        type: "Point",
        coordinates: this.startPoint
    };
    route.endPoint = {
        type: "Point",
        coordinates: this.endPoint
    };
    route.img = "https://maps.googleapis.com/maps/api/staticmap?center=" + route.startPoint.coordinates[0] + "," + route.startPoint.coordinates[1] +
    "&size=600x300&zoom=15&key=" + process.env.GOOGLE_MAPS_API_IMG;
    return next();
  });

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;