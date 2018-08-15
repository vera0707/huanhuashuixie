/**
 * Created by xieyuxuan on 2018/6/9.
 */

var mongoose = require('mongoose');
var userSchemas = require("../schemas/users");

module.exports =  mongoose.model('User',userSchemas);