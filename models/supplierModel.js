var mongoose = require('mongoose');

var supplierSchema = mongoose.Schema({
    name: String,
    description: String
})

module.exports = mongoose.model('Supplier', supplierSchema);
