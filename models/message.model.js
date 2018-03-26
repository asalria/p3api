const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const messageSchema = new mongoose.Schema({
   sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
   },
   reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
   },
   message: {
       type: String,
       required: ['true','A description of the route is required']
   }
},{
   timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;