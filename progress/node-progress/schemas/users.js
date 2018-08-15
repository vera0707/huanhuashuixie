
const mongoose = require('mongoose');


module.exact =  new mongoose.Schema({
    username : String,
    password : String,
    isAdmin : {
        type: Boolean,
        default: false
    }
});