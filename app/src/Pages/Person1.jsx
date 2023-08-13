import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client";
import { isExpired, decodeToken } from "react-jwt";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmojiPicker from 'emoji-picker-react';


const socket = io("http://localhost:8080");

function Person1() {
    var once = useRef(true);
    var navigate = useNavigate();
    var [sendmess, setsendmess] = useState({ message: "", to: "" });
    var [showfriendname, setshowfriendname] = useState({ name: "" });
    var [sentmess, setsentmess] = useState({ message: "", from: "" });
    var [receivemessaage, setreceivemessaage] = useState({ message: "", from: "" });
    var [myfriends, setmyfriends] = useState([]);
    var [reqlist, setreqlist] = useState([]);
    var [decodetoken, setdecodetoken] = useState("");
    var [friendmodel, setfriendmodel] = useState(false);
    var [reqmodel, setreqmodel] = useState(false);
    var [reqmodel, setreqmodel] = useState(false);
    var [searchdata, setsearchdata] = useState([]);
    var [loader, setloder] = useState(true);
    var [connecteduser, setconnecteduser] = useState([]);
    var [offlinemodel, setofflinemodel] = useState(false);
    var [emojipicker, setemojipicker] = useState(false);

    const findfriends = () => {
        const token = localStorage.getItem('token');
        const dtoken = decodeToken(token);
        var data = {
            email: dtoken.user.email
        }
        axios.post(`${process.env.REACT_APP_URL}/friend/findfriends`, data).then((res) => {
            if (res.data.message == "friend") {
                setmyfriends(res.data.userfriends);
                // console.log(res.data.userfriends)

            }
            if (res.data.message == "pending") {
                setreqlist(res.data.reqfriends);
            }
        })
        axios.post(`${process.env.REACT_APP_URL}/friend/reqlist`, data).then((res) => {
            if (res.data.message == "pending") {
                setreqlist(res.data.reqfriends);
            }
        })
    }
    let gooffline = () => {
        socket.emit("closetab");
    }


    useEffect(() => {
        const token = localStorage.getItem('token');
        const dtoken = decodeToken(token);
        setdecodetoken(dtoken);
        const tokenexpire = isExpired(token);
        if (token != null) {
            if (tokenexpire) {
                navigate('/login');
            }

        }
        else {
            navigate('/login');
        }


        findfriends()
        socket.emit("user_connected", (dtoken.user.username));
        setTimeout(() => {

            setloder(false);

        }, 1500);



    }, [])

    const handleinput = (e) => {
        setsendmess({ ...sendmess, [e.target.name]: e.target.value });

    }
    const handleinput2 = (e) => {
        // const ref = inputRef.current;
        // ref.focus();
        setsendmess({ ...sendmess, message: e.emoji });
        // console.log(e.emoji);

    }
    const openmodel = (e) => {
        setfriendmodel(true);
    }
    const openreqmodel = (e) => {
        setreqmodel(true);
    }
    const closemodel = (e) => {
        setfriendmodel(false);
    }
    const closereqmodel = (e) => {
        setreqmodel(false);
    }
    const addfriend = async (e, friendemail, friendname) => {
        // console.log(friendemail, friendname, decodetoken.user.email)
        var frienddata = {
            myemail: decodetoken.user.email,
            myname: decodetoken.user.username,
            friendemail: friendemail,
            friendname: friendname
        }
        await axios.post(`${process.env.REACT_APP_URL}/friend/sendfriendreq`, frienddata).then((res) => {
            if (res.data.message == "ok") {
                document.getElementById("addf").setAttribute("disabled", true);
            }
            if (res.data.message == "pending") {
                toast.info("Request already sent to that user");
            }
            if (res.data.message == "friend") {
                toast.info("You are already friend of that user");
            }
        })
    }
    const acceptreq = async (e, friendemail, friendname) => {
        // console.log(friendemail, friendname, decodetoken.user.email)
        var frienddata = {
            myemail: decodetoken.user.email,
            myname: decodetoken.user.username,
            friendemail: friendemail,
            friendname: friendname
        }
        await axios.post(`${process.env.REACT_APP_URL}/friend/updatereq`, frienddata).then((res) => {
            if (res.data.message == "done") {
                findfriends();
            }
        })
    }
    const search = async (e) => {
        var name = {
            username: e.target.value
        }
        await axios.post(`${process.env.REACT_APP_URL}/users/search`, name).then((res) => {
            setsearchdata(res.data.sdata);
        });
    }

    // ..................................message send receive...............................//

    const clickonfriend = (e, friendname) => {
        setshowfriendname({ name: friendname });
        setsendmess({ ...sendmess, to: friendname });

    }
    const sendmessage = async (e) => {
        setsentmess({
            ...sentmess,
            message: sendmess.message,
            from: decodetoken.user.username

        })
        var obj = {
            message: sendmess.message,
            to: sendmess.to,
            from: decodetoken.user.username
        }
        socket.emit("sendmessage", obj);
        document.getElementById("message").value = null;
        setsendmess({ ...sendmess, message: "" });
        console.log(sendmess);
    }

    socket.on("connected_user", (cu) => {
        setconnecteduser(cu);
    })
    socket.on("receivemessage", (data) => {
        setreceivemessaage({
            message: data.message,
            from: data.from,
        })


    })
    const addsentmessageelement = (data) => {

        const para = document.createElement("div")
        const para1 = document.createElement("div")
        const para2 = document.createElement("div")
        const para3 = document.createElement("div")
        let element = document.getElementById("messageelement");
        para3.classList.add("relative", "mr-3", "text-sm", "bg-indigo-100", "py-2", "px-4", "shadow", "rounded-xl");
        let element1 = element.appendChild(para);
        element1.classList.add("col-start-6", "col-end-13", "p-3", "rounded-lg");
        let element2 = element1.appendChild(para1);
        element2.classList.add("flex", "items-center", "justify-start", "flex-row-reverse");
        let element3 = element2.appendChild(para2);
        element3.classList.add("flex", "items-center", "uppercase", "justify-center", "h-10", "w-10", "rounded-full", "bg-indigo-500", "flex-shrink-0");

        element3.innerHTML = `${decodetoken.user.username[0]}`;
        let element4 = element2.appendChild(para3);
        element4.classList.add("relative", "mr-3", "text-sm", "bg-indigo-100", "py-2", "px-4", "shadow", "rounded-xl");
        element4.innerHTML = `${data.message}`;
        setsentmess({ message: "", from: "" });


    }
    const addreceivemessageelement = (data) => {
        const para = document.createElement("div")
        const para1 = document.createElement("div")
        const para2 = document.createElement("div")
        const para3 = document.createElement("div")
        let element = document.getElementById("messageelement");
        // para.classList.add("col-start-1 col-end-8 p-3 rounded-lg");
        // para1.classList.add("flex flex-row items-center");
        // para2.classList.add("flex items-center uppercase justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0");
        // para3.classList.add("relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl");
        let element1 = element.appendChild(para);
        element1.classList.add("col-start-1", "col-end-8", "p-3", "rounded-lg");
        let element2 = element1.appendChild(para1);
        element2.classList.add("flex", "flex-row", "items-center");
        let element3 = element2.appendChild(para2);
        element3.classList.add("flex", "items-center", "uppercase", "justify-center", "h-10", "w-10", "rounded-full", "bg-indigo-500", "flex-shrink-0");
        element3.innerHTML = `${data.from[0]}`;
        let element4 = element2.appendChild(para3);
        element4.classList.add("relative", "ml-3", "text-sm", "bg-white", "py-2", "px-4", "shadow", "rounded-xl");
        element4.innerHTML = `${data.message}`;
        setreceivemessaage({ message: "", from: "" });


    }
    const removeelement = (e) => {
        var el = document.getElementById("ppa");
        var child = el.lastElementChild;
        while (child) {
            el.removeChild(child);
            child = e.lastElementChild;
        }
    }
    var emojivala = (e) => {
        setemojipicker(true);
    }
    var closeemoji = (e) => {
        setemojipicker(false);
    }

    return (
        <div>
            {loader ? (
                <>
                    <div class="text-center">
                        <div role="status">
                            <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                </>
            ) : (<>

                <div class="flex h-screen antialiased text-gray-800">
                    <div class="flex flex-row h-full w-full overflow-x-hidden">
                        <div class="flex flex-col py-8 pl-6 pr-2 w-70 bg-white flex-shrink-0">
                            <div class="flex flex-row items-center justify-center h-1 w-full">
                                <div
                                    class="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10"
                                >
                                    <svg
                                        class="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                        ></path>
                                    </svg>
                                </div>

                                <div class="ml-2 font-bold text-2xl">QuickChat</div>
                            </div>

                            <div class="flex flex-col  mt-8">


                                <div class="border-b-2 py-3 px-6">
                                    <div class="grid grid-flow-col auto-cols-max gap-2">
                                        <input
                                            type="text"
                                            placeholder="search contact"
                                            class="py-0  px-2 border-2 border-gray-200 rounded-2xl w-40"
                                        />


                                    </div>


                                </div>
                                {/* <div class="flex flex-row items-center mt-3">
                                    <div
                                        class="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full"
                                    >
                                        <div class="h-3 w-3 bg-white rounded-full self-end mr-1"></div>
                                    </div>
                                    <div class="leading-none ml-1 text-xs">Active Friends</div>
                                </div> */}







                                <div class="flex flex-col space-y-1 mt-4 -mx-2 h-50 overflow-y-auto">
                                    {
                                        myfriends.map((friend, index) => (
                                            <>
                                                {
                                                    connecteduser.map((user) => (
                                                        <>
                                                            {
                                                                (friend.friendname == user) ? (<>
                                                                    <button onClick={(e) => clickonfriend(e, friend.friendname)}
                                                                        class=" relative flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                                                                    >
                                                                        <div
                                                                            class="flex uppercase items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"
                                                                        >
                                                                            {friend.friendname[0]}

                                                                        </div>
                                                                        <span class="block ml-2 font-bold text-gray-600">{friend.friendname}</span>
                                                                        <span class="absolute w-3 h-3 bg-green-600 rounded-full left-8 top-2"></span>

                                                                    </button>
                                                                </>) : null
                                                            }

                                                        </>
                                                    ))
                                                }
                                                {/* <button onClick={(e) => clickonfriend(e, friend.room, friend.friendname)}
                                                    class=" relative flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                                                >
                                                    <div
                                                        class="flex uppercase items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"
                                                    >
                                                        {friend.friendname[0]}

                                                    </div>
                                                    <span class="block ml-2 font-bold text-gray-600">{friend.friendname}</span>
                                                    <span class="absolute w-3 h-3 bg-green-600 rounded-full left-8 top-2"></span>
                                                    
                                                </button> */}

                                            </>
                                        ))
                                    }





                                </div>
                                {/* <div class="py-3 px-0">
                                    <button onClick={(e) => openmodel(e)} class="flex flex-row items-center hover:bg-blue-200 rounded-xl p-1">

                                        <svg class="h-10 w-10 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <circle cx="12" cy="12" r="10" />  <line x1="12" y1="8" x2="12" y2="16" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>
                                        <div class="ml-2 text-sm font-semibold">Add friends</div>
                                        <div class="ml-2 text-sm font-semibold">My friends</div>
                                    </button>

                                </div> */}

                            </div>
                        </div>
                        {

                        }
                        <div class="flex flex-col flex-auto p-6">

                            <div
                                class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100  h-full p-4"
                            >
                                <div class="relative  flex items-center space-x-4">

                                    <div
                                        class="flex uppercase items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"
                                    >
                                        {showfriendname.name[0]}

                                    </div>
                                    <div class="flex flex-col leading-tight">
                                        <div class="text-xl mt-1 flex items-center">
                                            <span class="text-gray-700 mr-3">{showfriendname.name}</span>
                                        </div>

                                    </div>
                                </div>
                                <hr class='mt-2'></hr>
                                <div class="flex flex-col h-full overflow-x-auto mb-4">
                                    <div id="ppa" class="flex flex-col h-full">
                                        <div id='messageelement' class="grid  grid-cols-12 gap-y-2">
                                            {
                                                (receivemessaage.message != "") ? (
                                                    addreceivemessageelement(receivemessaage)
                                                ) : null
                                            }
                                            {
                                                (sentmess.message != "") ? (
                                                    addsentmessageelement(sentmess)
                                                ) : null
                                            }

                                            {/* {

                                                (receivemessaage.from != decodetoken.user.username && receivemessaage.message != "") ? (
                                                    <>
                                                        <div class="col-start-1 col-end-8 p-3 rounded-lg">
                                                            <div class="flex flex-row items-center">
                                                                <div
                                                                    class="flex items-center uppercase justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                                                                >
                                                                    {receivemessaage.from[0]}
                                                                </div>
                                                                <div
                                                                    class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                                                                >
                                                                    <div>{receivemessaage.message}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {
                                                            (sentmess.message != "") ? (
                                                                <>
                                                                    <div class="col-start-6 col-end-13 p-3 rounded-lg">
                                                                        <div class="flex items-center justify-start flex-row-reverse">
                                                                            <div
                                                                                class="flex items-center uppercase justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                                                                            >
                                                                                {sentmess.from[0]}
                                                                            </div>
                                                                            <div
                                                                                class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                                                                            >
                                                                                <div>{sentmess.message}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : null
                                                        }

                                                    </>
                                                )
                                            }
                                            {

                                            } */}
                                            {/* {
                                                (sentmess.message != "") ? (
                                                    <>
                                                        <div class="col-start-6 col-end-13 p-3 rounded-lg">
                                                            <div class="flex items-center justify-start flex-row-reverse">
                                                                <div
                                                                    class="flex items-center uppercase justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                                                                >
                                                                    {sentmess.from[0]}
                                                                </div>
                                                                <div
                                                                    class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                                                                >
                                                                    <div>{sentmess.message}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : null
                                            } */}






                                        </div>
                                    </div>
                                    {
                                        emojipicker ? (
                                            <>
                                                <div class="flex-grow ml-4">
                                                    <div class="relative w-full">
                                                        <button onClick={(e) => closeemoji(e)} class="text-red-400">X</button>
                                                        <EmojiPicker
                                                            onEmojiClick={(e) => handleinput2(e)}

                                                        />
                                                    </div>

                                                </div>



                                            </>
                                        ) : null
                                    }
                                </div>
                                <div
                                    class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
                                >
                                    {/* <div>
                                        <button onClick={e => removeelement(e)}
                                            class="flex items-center justify-center text-gray-400 hover:text-gray-600"
                                        >
                                            <svg
                                                class="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div> */}


                                    <div class="flex-grow ml-4">

                                        <div class="relative w-full">
                                            <input id="message"
                                                name='message'
                                                type="text"
                                                class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                                onChange={(e) => handleinput(e)}
                                                value={sendmess.message}
                                            />
                                            <button onClick={(e) => emojivala(e)}
                                                class="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                                            >

                                                <svg
                                                    class="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    ></path>
                                                </svg>
                                            </button>

                                        </div>

                                    </div>
                                    <div class="ml-4">
                                        <button onClick={(e) => sendmessage(e)}
                                            class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0" type='button'
                                        >
                                            <span>Send</span>
                                            <span class="ml-2">
                                                <svg
                                                    class="w-4 h-4 transform rotate-45 -mt-px"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                    ></path>
                                                </svg>
                                            </span>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col py-8 pr-6 pl-6 pr-2 w-70 bg-white flex-shrink-0">
                            <div class="flex flex-row items-center justify-center h-1 w-full">


                                <div class=" font-bold text-2xl">My Friends</div>
                            </div>

                            <div class="flex flex-col  mt-8">


                                <div class="border-b-2 items-center justify-center py-3 w-full ">
                                    <div class="grid grid-flow-col auto-cols-max gap-2">
                                        <input
                                            type="text"
                                            placeholder="search contact"
                                            class="py-0  px-2 border-2 border-gray-200 rounded-2xl w-40"
                                        />
                                        <span class="relative">
                                            <span class="relative inline-block">
                                                <button onClick={(e) => openreqmodel(e)}><svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    class="text-gray-600 w-6 h-6"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"
                                                    />
                                                </svg></button>
                                                <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{reqlist.length}</span>
                                            </span>
                                        </span>


                                    </div>


                                </div>







                                <div class="flex flex-col space-y-1 mt-4 -mx-2 h-49 overflow-y-auto">
                                    {
                                        myfriends.map((friend, index) => (
                                            <>
                                                <div
                                                    class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                                                >
                                                    <div
                                                        class="flex uppercase items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"
                                                    >
                                                        {friend.friendname[0]}
                                                    </div>
                                                    <div class="ml-2 text-sm font-semibold">{friend.friendname}</div>
                                                </div>
                                            </>
                                        ))
                                    }





                                </div>
                                <div class="py-3 px-0">
                                    <button onClick={(e) => openmodel(e)} class="flex flex-row items-center hover:bg-blue-200 rounded-xl p-1">

                                        <svg class="h-10 w-10 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <circle cx="12" cy="12" r="10" />  <line x1="12" y1="8" x2="12" y2="16" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>
                                        <div class="ml-2 text-sm font-semibold">Add friends</div>
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>

                </div>
                {
                    friendmodel ? (
                        <>
                            <div className="justify-center my-10 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                <div class="relative w-full max-w-md max-h-full">
                                    {/* <!-- Modal content --> */}
                                    <div class="relative bg-white rounded-lg shadow dark:bg-white">
                                        <button onClick={(e) => closemodel(e)} type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal">
                                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                            <span class="sr-only">Close modal</span>
                                        </button>
                                        <div class="px-6 py-6 lg:px-8">
                                            <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-dark">Find Friends</h3>
                                            <div class="w-full">

                                                <div class="relative">

                                                    {/* <!-- search input --> */}
                                                    <div class=" py-3 px-2">
                                                        <input type="search" onChange={(e) => search(e)} class="w-full py-2 px-2 text-xl" autocomplete="off" placeholder="Search" />
                                                        {/* <!-- end search input --> */}
                                                    </div>
                                                    {/* <!-- search result --> */}
                                                    <div class="absolute z-10 w-full border divide-y shadow max-h-72 overflow-y-auto bg-white ...">
                                                        {
                                                            searchdata.map((user, index) => (
                                                                <>
                                                                    {
                                                                        (user.username != decodetoken.user.username) ? (
                                                                            <>
                                                                                <div class="grid grid-cols-3 gap-4">
                                                                                    <a class="block p-2 hover:bg-indigo-50 col-span-2 ...">{user.username}</a>
                                                                                    <button id="addf" onClick={(e) => addfriend(e, user.email, user.username)} class="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">+Add</button>
                                                                                </div>
                                                                            </>
                                                                        ) : null
                                                                    }

                                                                </>


                                                            ))
                                                        }


                                                    </div>
                                                    {/* <!-- end search result --> */}
                                                </div>


                                            </div>

                                        </div>


                                    </div>
                                </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>

                        </>
                    ) : null
                }
                {
                    reqmodel ? (
                        <>
                            <div className="justify-center my-10 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                <div class="relative w-full max-w-md max-h-full">
                                    {/* <!-- Modal content --> */}
                                    <div class="relative bg-white rounded-lg shadow dark:bg-white">
                                        <button onClick={(e) => closereqmodel(e)} type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal">
                                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                            <span class="sr-only">Close modal</span>
                                        </button>
                                        <div class="px-6 py-6 lg:px-8">
                                            <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-dark">Friend Requests</h3>
                                            <div class="overflow-y-auto h-24 ">
                                                {
                                                    reqlist.map((user, index) => (
                                                        <>
                                                            <div class="grid grid-cols-3 gap-4">
                                                                <a class="block p-2 hover:bg-indigo-50 col-span-2 ...">{user.myname}</a>
                                                                <button id="addf" onClick={(e) => acceptreq(e, user.myemail, user.myname)} class="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">Accept</button>
                                                            </div>
                                                        </>


                                                    ))
                                                }
                                            </div>


                                        </div>


                                    </div>
                                </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>

                        </>
                    ) : null
                }
                {
                    offlinemodel ? (
                        <>
                            <div className="justify-center my-10 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                <div class="relative w-full max-w-md max-h-full">
                                    {/* <!-- Modal content --> */}
                                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                        <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="popup-modal">
                                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                            <span class="sr-only">Close modal</span>
                                        </button>
                                        <div class="p-6 text-center">
                                            <svg aria-hidden="true" class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
                                            <button data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                                Yes, I'm sure
                                            </button>
                                            <button data-modal-hide="popup-modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>

                        </>
                    ) : null
                }
                <ToastContainer />
            </>
            )}
        </div>
    )
}

export default Person1