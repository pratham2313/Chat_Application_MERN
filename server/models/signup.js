const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/auth');
//mongoose.connect('mongodb://localhost:27017/rate');


var userdata = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    role: String
});

const userdatamodel = mongoose.model('userdata', userdata);
module.exports = userdatamodel;