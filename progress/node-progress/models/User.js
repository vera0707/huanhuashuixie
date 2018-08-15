const mongoose = require("mongoose");
const userSchema = require("./schemas/users");

module.export = mongoose.model('User',userSchema);