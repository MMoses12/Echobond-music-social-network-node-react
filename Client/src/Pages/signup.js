// Basic imports.
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

// Import axios for requests.
import axios from "axios"

// Import components.
import Navbar from "../components/HomePage/navbar"
import ErrorMessage from "../components/errorMessage"

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons' 

// Import photos.
import Background from "../Photos/LogIn.jpg"

// Sign up form.
function SignUp () {  
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    // Show passwords.
    const [passwordShown, setPasswordShown] = useState(false)
    const [confPasswordShown, setConfPasswordShown] = useState(false)

    // Send credentials to the server.
    const signUp = (event) => {
        event.preventDefault();

        // Check if there are the data or user pressed submit button.
        if (!username || !password || !email || event.type !== "submit") {
            setError("notCompleted")
            return;
        }

        if (password !== confPassword) {
            setError("passwordMatch")
            return
        }

        // IP with tailscale.
        axios.post("http://localhost:4000/otp/send-otp", { username, email, register: true })
            .then(response => {
                navigate("/otp", { state: { username, password, email }})
            })
            .catch(error => {
                console.log("Error sending OTP", error);
            });
    };

    // Get user's input username.
    const changeUsername = (event) => {
        setUsername(event.target.value)
    }

    // Get user's input confirm password.
    const changeConfPassword = (event) => {
        setConfPassword(event.target.value)

        if (event.target.value.length > 0 && event.target.value !== password) {
            setError("passwordMatch")
        }
        else {
            setError("")
        }
    }

    // Get user's input password.
    const changePassword = (event) => {
        setPassword(event.target.value)

        if (event.target.value.length < 8 && event.target.value.length > 0) {
            setError("passwordLength")
        }
        else {
            setError("")
        }
    }

    // Get user's input email.
    const changeEmail = (event) => {
        setEmail(event.target.value)
    }

    // Navigate to login page. Replace in
    // the history.
    const navigateLogin = () => {
        navigate("/login", { replace: true })
    }
    
    // Change the showing of password and
    // confirm password.
    const showPassword = () => {
        setPasswordShown(!passwordShown);
    }

    const showConfPassword = () => {
        setConfPasswordShown(!confPasswordShown);
    }

    return (
        <div className="log-container w-screen h-screen flex flex-col" style={{backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <Navbar  isLogged={false} loginScreen={true} />
            <div className="flex flex-col items-center h-full">
                <div className="log-box">
                    <div className="pt-5 select-none">
                        <p className="text-5xl font-bold font-exo text-white"> Sign up and start listening </p>
                    </div>
                    <div className="m-4">
                        <div className="h-fit py-2 px-5">
                            <form onSubmit={signUp} className="flex flex-col justify-center items-center pt-10 gap-2">
                                <div className="pb-3 w-fit"> 
                                    <input
                                        className="h-10 w-64 rounded-full select-none pl-4 font-exo text-md focus:outline-none border-2 border-gray-500 hover:border-2 hover:border-purple-200 focus:border-2 focus:border-purple-200"
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Username"
                                        onChange={changeUsername}
                                    />
                                </div>
                                <div className="pb-3 w-fit"> 
                                    <input
                                        className="h-10 w-64 rounded-full select-none pl-4 font-exo text-md focus:outline-none border-2 border-gray-500 hover:border-2 hover:border-purple-200 focus:border-2 focus:border-purple-200"
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Email"
                                        onChange={changeEmail}
                                    />
                                </div>
                                <div className="relative w-fit pb-3">
                                    <input
                                        className="h-10 w-64 rounded-full select-none pl-4 pr-10 text-md font-exo select-none border-2 border-gray-500 hover:border-2 hover:border-purple-200 focus:outline-none focus:border-2 focus:border-purple-200"
                                        type={passwordShown ? 'text' : 'password'}
                                        placeholder="Password"
                                        autoComplete="off"
                                        onChange={changePassword}
                                    />
                                    <i
                                        className="absolute inset-y-0 -top-3 right-0 pr-3 flex items-center text-sm leading-5"
                                        onClick={showPassword}
                                    >
                                        <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} className="cursor-pointer" />
                                    </i>
                                </div>
                                <div className="relative w-fit">
                                    <input
                                        className="h-10 w-64 rounded-full select-none pl-4 pr-10 text-md font-exo select-none border-2 border-gray-500 hover:border-2 hover:border-purple-200 focus:outline-none focus:border-2 focus:border-purple-200"
                                        type={confPasswordShown ? 'text' : 'password'}
                                        placeholder="Confirm Password"
                                        autoComplete="off"
                                        onChange={changeConfPassword}
                                    />
                                    <i
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                        onClick={showConfPassword}
                                    >
                                        <FontAwesomeIcon icon={confPasswordShown ? faEyeSlash : faEye} className="cursor-pointer" />
                                    </i>
                                </div>
                                <ErrorMessage error={error} />

                                {/* Submit button */}
                                <input type="submit" className="text-white font-nunito w-fit rounded-xl bg-purple-200 hover:bg-purple-300 px-5 py-1.5 mt-7 select-none cursor-pointer" value="Sign up" />
                                   
                                <hr className="border-1 border-purple-300 w-full mt-4" />
                                <div className="flex flex-row mt-1">
                                    <p className="text-white text-md font-exo"> If you have already an account </p>
                                    <button onClick={navigateLogin} className="ml-3 outline-none bg-transparent underline text-white hover:text-purple-200 font-exo font-bold"> Log In </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp
