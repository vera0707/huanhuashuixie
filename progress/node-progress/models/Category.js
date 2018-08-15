const mongoose = require('mongoose');
const cagetorySchema = require("./../schemas/category");

module.exports = mongoose.model('Category',cagetorySchema);