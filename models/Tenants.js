const mongoose = require('mongoose');


const tenantSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    phone: String,
    address: String,
    debt: Number,
},
 
)

module.exports = mongoose.model('Tenants', tenantSchema);
