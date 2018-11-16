const mongoose = require('mongoose');


const logSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId:{type: mongoose.Schema.Types.ObjectId, ref:'User', require},
    entry:Number,
    leaving:Number,
},
 
)

module.exports = mongoose.model('Log', logSchema);
