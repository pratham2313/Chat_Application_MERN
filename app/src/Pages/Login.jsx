import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { isExpired, decodeToken } from "react-jwt";
function Login() {
    var navigator = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        const tokenexpire = isExpired(token);
        if (token != null) {
            if (tokenexpire) {
                navigator('/login');
            }
            else {
                navigator('/chat')
            }

        }
        else {
            navigator('/login');
        }
    }, [])
    const [userdata, setuserdata] = useState({ email: "", password: "" });
    const handleinput = (e) => {
        setuserdata({ ...userdata, [e.target.name]: e.target.value });
    }
    const submit = async (e) => {
        e.preventDefault();
        await axios.post(`${process.env.REACT_APP_URL}/users/login`, userdata).then((res) => {
            if (res.data.message == "ok") {
                localStorage.setItem("token", res.data.token);
                navigator('/chat');
            }
        })
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
                                    <label class="block text-sm text-black" for="email">E-mail</label>
                                    <input onChange={(e) => handleinput(e)} class="w-full bg-opacity-50 px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white" type="email" name='email' id="email" placeholder="Email" aria-label="email" required />
                                </div>
                                <div class="mt-5">
                                    <label class="block  text-sm text-black">Password</label>
                                    <input onChange={(e) => handleinput(e)} class="w-full px-5 bg-opacity-50 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                                        type="password" id="password" name='password' placeholder="*****" arial-label="password" required />
                                </div>

                                <div class="mt-4 items-center flex justify-between">
                                    <button onClick={(e) => submit(e)} class="px-4 py-1 text-white font-light tracking-wider bg-gray-900 hover:bg-gray-800 rounded"
                                        type="button">Submit</button>
                                    <a class="inline-block right-0 align-baseline font-bold text-sm text-500 text-black hover:text-red-400"
                                        href="#">forget password ?</a>
                                </div>
                                <div class="text-center">
                                    <a href='/signup' class="inline-block right-0 align-baseline font-light text-sm text-500 hover:text-red-400">
                                        Create an account
                                    </a>
                                </div>

                            </form>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login