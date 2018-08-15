/**
 * Created by xieyuxuan on 2018/6/14.
 */
var mongoose = require('mongoose');
var categoriesSchemas = require('../schemas/categories');
module.exports = mongoose.model('category',categoriesSchemas);