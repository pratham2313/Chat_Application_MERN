import React, { useState } from 'react'
import axios, { isCancel, AxiosError } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";

function Signup() {
    var nevigate = useNavigate();
    var [userdata, setuserdata] = useState({ username: "", email: "", password: "", confirmpassword: "" });
    const handleinput = (e) => {
        setuserdata({ ...userdata, [e.target.name]: e.target.value });
    }
    const register = async (e) => {
        e.preventDefault();
        if (userdata.password == userdata.confirmpassword) {
            await axios.post(`${process.env.REACT_APP_URL}/users/signup`, userdata).then((res) => {
                console.log(res.data.message);
                if (res.data.message == "ok") {
                    toast.success("registration successful");
                    setTimeout(() => {
                        nevigate('/login');
                    }, 1500);
                }
                if (res.data.message == "emailtaken") {
                    toast.info("Email already exist")
                }
                if (res.data.message == "usernametaken") {
                    toast.info("Username already taken by some user")
                }
            })
        }
        else {
            toast.error("password and confirm password not match");
        }

        // console.log(userdata);
    }
    return (
        <div>
            <div class="h-screen font-sans login bg-cover">
                <div class="container mx-auto h-full flex flex-1 justify-center items-center">
                    <div class="w-full max-w-lg">
                        <div class="leading-loose">
                            <form class="max-w-sm m-4 p-10 bg-white bg-opacity-25 rounded shadow-xl">
                                <p class="text-black font-medium text-center text-lg font-bold">LOGIN</p>
                                <div class="">
                                    <label class="block text-sm text-black" for="email">Username</label>
                                    <input onChange={(e) => handleinput(e)} class="w-full bg-opacity-50 px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white" type="text" name='username' id="uname" placeholder="Username" aria-label="username" required />
                                </div>
                                <div class="mt-5">
                                    <label class="block text-sm text-black" for="email">E-mail</label>
                                    <input onChange={(e) => handleinput(e)} class="w-full bg-opacity-50 px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white" type="email" name='email' id="email" placeholder="Email" aria-label="email" required />
                                </div>
                                <div class="mt-5">
                                    <label class="block  text-sm text-black">Password</label>
                                    <input onChange={(e) => handleinput(e)} class="w-full px-5 bg-opacity-50 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                                        type="password" name='password' id="password" placeholder="*****" arial-label="password" required />
                                </div>
                                <div class="mt-5">
                                    <label class="block  text-sm text-black">Confirm Password</label>
                                    <input onChange={(e) => handleinput(e)} class="w-full px-5 bg-opacity-50 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                                        type="password" name='confirmpassword' placeholder="*****" arial-label="password" required />
                                </div>

                                <div class="mt-4 items-center flex justify-between">
                                    <button onClick={(e) => register(e)} class="px-4 py-1 text-white font-light tracking-wider bg-gray-900 hover:bg-gray-800 rounded"
                                        type="button">Submit</button>

                                </div>
                                <div class="text-center">
                                    <a href='/login' class="inline-block right-0 align-baseline font-light text-sm text-500 hover:text-red-400">
                                        Already have an account
                                    </a>
                                </div>

                            </form>

                        </div>
                        <ToastContainer />
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Signup