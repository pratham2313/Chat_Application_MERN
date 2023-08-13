const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/auth');
//mongoose.connect('mongodb://localhost:27017/rate');


var frind_list = new mongoose.Schema({
    myemail: String,
    myname: String,
    friendemail: String,
    friendname: String,
    sendto: String,
    room: String,
    status: String,
});

const friendmodel = mongoose.model('friend_list', frind_list);
module.exports = friendmodel;