const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const friendmodel = require('../models/friend_list');

router.post('/sendfriendreq', async (req, res) => {
    try {
        var myemail = req.body.myemail;
        var friendemail = req.body.friendemail;
        var oldreq = await friendmodel.findOne({ myemail, friendemail });
        if (oldreq) {
            if (oldreq.status == "pending") {
                res.json({ message: "pending" })
            }
            if (oldreq.status == "friend") {
                res.json({ message: "friend" });
            }
        }

        else {
            var friend = new friendmodel({
                myemail: req.body.myemail,
                myname: req.body.myname,
                friendemail: req.body.friendemail,
                friendname: req.body.friendname,
                sendto: req.body.friendemail,
                room: req.body.myemail,
                status: "pending",
            })
            friend.save().then(() => {
                var friend = new friendmodel({
                    myemail: req.body.friendemail,
                    myname: req.body.friendname,
                    friendemail: req.body.myemail,
                    friendname: req.body.myname,
                    room: req.body.myemail,
                    status: "pending",
                })
                friend.save().then(() => {
                    console.log("ok");
                    res.json({ message: "ok" });
                }).catch((err) => {
                    res.json({ message: "swr" });
                })
            }).catch((err) => {
                res.json({ message: "swr" });
            })
        }


    }
    catch (e) {
        throw e
    }
})
router.post('/updatereq', async (req, res) => {
    try {
        var myemail = req.body.myemail;
        var friendemail = req.body.friendemail;
        var result = await friendmodel.updateOne({ myemail, friendemail }, {
            $set: {
                status: "friend"
            }
        })
        if (result) {
            myemail = req.body.friendemail;
            friendemail = req.body.myemail;
            var result1 = await friendmodel.updateOne({ myemail, friendemail }, {
                $set: {
                    status: "friend"
                }
            })
            if (result1) {
                res.json({ message: "done" });
            }

        }





    }
    catch (e) {
        throw e
    }
})

router.post('/findfriends', async (req, res) => {
    var myemail = req.body.email;
    var status = "friend"
    var frienddata = await friendmodel.find({ myemail, status });

    if (frienddata) {
        res.json({ userfriends: frienddata, message: "friend" });
    }


})
router.post('/reqlist', async (req, res) => {
    var sendto = req.body.email;
    status = "pending"
    var reqlist = await friendmodel.find({ sendto, status });

    // var reqdata = await friendmodel.find({ myemail, status: "pending" });
    if (reqlist) {
        res.json({ reqfriends: reqlist, message: "pending" });

    }
})
module.exports = router;