
const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chatapplication');

// app.use(cors({
//     origin: '*'
// }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // res.header("Access-Control-Allow-Credentials", "true"); // add this line to allow cookie access
    next();
});
const corsOptions = {
    origin: ["*"],
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions));
app.use('/api/users', require('./routes/user'));
app.use('/api/friend', require('./routes/friend'));
app.get('/', (req, res) => res.send('Hello World!'));
var users = [];
var connecteduser = [];
const http = require("http");
const { send } = require('process');
const { error } = require('console');
const socket = http.createServer(app)
const io = require("socket.io")(socket, {
    cors: {
        // origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    // send a message to the client
    // const id = socket.id;
    // socket.emit("getid", id);
    // socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });

    // receive a message from the client
    var count = 0;
    socket.on("user_connected", (username) => {
        users[username] = socket.id;
        // connecteduser.push(username);
        connecteduser.map((user) => {
            if (user == username) {
                count = count + 1;
            }
        })
        if (count == 0) {
            connecteduser.push(username);
        }
        io.emit("connected_user", connecteduser);
    })
    socket.on("sender", (data) => {
        console.log(data.message);
        console.log(data.to);
        io.to(data.to).emit("receiver", { rmess: data.message });
    });
    socket.on("closetab", () => {
        console.log("tab close");
        console.log(connecteduser);
    })
    socket.on("sendmessage", (data) => {
        socket.to(users[data.to]).emit("receivemessage", {
            message: data.message,
            from: data.from
        })
        // console.log(data.to);
    })
});
socket.listen(8080, () => console.log("Socket server is running on port 8001"))




app.listen(port, () => { });
    // const addreceivemessageelement = (data) => {
    //     const para = document.createElement("div")
    //     const para1 = document.createElement("div")
    //     const para2 = document.createElement("div")
    //     const para3 = document.createElement("div")
    //     let element = document.getElementById("messageelement");
    //     // para.classList.add("col-start-1 col-end-8 p-3 rounded-lg");
    //     // para1.classList.add("flex flex-row items-center");
    //     // para2.classList.add("flex items-center uppercase justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0");
    //     // para3.classList.add("relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl");
    //     let element1 = element.appendChild(para);
    //     // element1.classList.add("col-start-1 col-end-8 p-3 rounded-lg");
    //     let element2 = element1.appendChild(para1);
    //     // element2.classList.add("flex flex-row items-center");
    //     let element3 = element2.appendChild(para2);
    //     // element3.classList.add("flex items-center uppercase justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0");

    //     element3.innerHTML = `${data.from[0]}`;
    //     let element4 = element2.appendChild(para3);
    //     // element4.classList.add("relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl");
    //     element4.innerHTML = `${data.message}`;


    // }
    // const addsentmessageelement = (sendmess) => {
    //     const para = document.createElement("div")
    //     const para1 = document.createElement("div")
    //     const para2 = document.createElement("div")
    //     const para3 = document.createElement("div")
    //     let element = document.getElementById("messageelement");
    //     // para.classList.add("col-start-6 col-end-13 p-3 rounded-lg");
    //     // para1.classList.add("flex items-center justify-start flex-row-reverse");
    //     // para2.classList.add("flex items-center uppercase justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0");
    //     // para3.classList.add("relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl");
    //     let element1 = element.appendChild(para);
    //     // element1.classList.add("col-start-1", "col-end-8", "p-3", "rounded-lg");
    //     let element2 = element1.appendChild(para1);
    //     // element2.classList.add("flex items-center", "justify-start", "flex-row-reverse");
    //     let element3 = element2.appendChild(para2);
    //     // element3.classList.add("flex", " items-center", "uppercase", "justify-center", "h-10", "w-10", "rounded-full", "bg-indigo-500", "flex-shrink-0");
    //     element3.innerHTML = `${sendmess.from[0]}`;
    //     let element4 = element2.appendChild(para3);
    //     // element4.classList.add("relative", "mr-3", "text-sm", "bg-indigo-100", "py-2", "px-4", "shadow", "rounded-xl");
    //     element4.innerHTML = `${sendmess.message}`;


    // }