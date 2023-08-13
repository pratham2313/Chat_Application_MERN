const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userdatamodel = require('../models/signup')
const jwt = require('jsonwebtoken');
const jwtkey = "dhoni";


//var tools = require('./index');


router.get('/test', (req, res) => {
    res.send("hello");
})
router.post('/signup', async (req, res) => {

    try {
        const email = req.body.email;
        const username = req.body.username;
        const useremail = await userdatamodel.findOne({ email });
        const usernamedup = await userdatamodel.findOne({ username });
        if (useremail) {
            res.json({ message: "emailtaken" })
        }
        else if (usernamedup) {
            res.json({ message: "usernametaken" });
        }
        else {
            const password = req.body.password;
            const encryptpass = await bcrypt.hash(password, 7);
            var userdata1 = new userdatamodel({
                username: req.body.username,
                email: req.body.email,
                password: encryptpass,
            });
            userdata1.save().then(() => {
                res.json({ message: "ok" });
            }).catch((err) => {
                res.json({ message: "swr" });
            })
        }



    }
    catch (e) {
        // console.log(e);
    }
});
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await userdatamodel.findOne({ email });

        if (user) {

            bcrypt.compare(password, user.password, function (err, isMatch) {

                if (err) {
                    throw err
                    // console.log(err);
                }
                else if (!isMatch) {
                    console.log("not match")
                    res.json({ message: "notmatch" })

                }
                else {
                    jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, token) => {
                        if (err) {
                            throw err
                        }
                        else {
                            res.json({ token: token, message: "ok" });

                        }
                    })
                }
            })
        }
        else {
            res.json({ message: "unf" });
        }



    }
    catch (e) {
        // console.log(e);
    }
});
router.post('/search', async (req, res) => {
    try {
        const name = req.body.username.trim();
        if (name == "") {
            res.json({ sdata: [] });
        }
        var search = await userdatamodel.find({ username: { $regex: new RegExp('^' + name, 'i') } }).exec();
        search = search.slice(0, 10);

        if (search) {
            res.json({ sdata: search });
        }
        else {
            res.json({ message: "not found", sdata: null });
        }



    }
    catch (e) {
        // console.log(e);
    }
});

module.exports = router;
