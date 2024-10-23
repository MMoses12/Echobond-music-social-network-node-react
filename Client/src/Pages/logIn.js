// Basic imports..
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

// Import axios for requests.
import axios from "axios"

// Import components.
import Navbar from "../components/HomePage/navbar"

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

// For toast.
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import photos.
import Background from "../Photos/LogIn.jpg"
import ErrorMessage from "../components/errorMessage"

// Login form.
function Login () {  
    const navigate = useNavigate()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [passwordShown, setPasswordShown] = useState(false)
    const [error, setError] = useState('')

    const notify = (message) => {
        toast(message)
    }

    // Navigate to register page. Replace in
    // the history.
    const navigateRegister = () => {
        navigate("/register", { replace: true })
    }

    // Change the showing of the password
    // and confirm password.
    const showPassword = () => {
      setPasswordShown(!passwordShown);
    }

    // Change the username based of user's input.
    const changeUsername = (event) => {
        setUsername(event.target.value)

        if (error) {
            setError('')
        }
    }

    // Change the password based of user's input.
    const changePassword = (event) => {
        setPassword(event.target.value)
        
        if (error) {
            setError('')
        }
    }

    // Send credentials to the server.
    const logIn = (event) => {
        event.preventDefault()

        // Check if there are the data or user
        // pressed submit button.
        if (!username || !password || event.type !== "submit") {
            setError("notCompleted")
            return
        }

        setUsername('')
        setPassword('')

        // IP with tailscale.
        axios.post("http://100.91.43.32:4000/user/login", { username, password })
        .then(response => {
            localStorage.setItem('accessToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            
            navigate("/musicHome", { replace: true })
        })
        .catch(error => {
            setError("loginError")
        })
    }

    // Forgot password request.
    const forgotPassword = () => {
        if (!username) {
            return
        }
        
        // IP with tailscale.
        axios.post("http://100.91.43.32:4000/user/forgot-password", { username })
        .then(response => {
            notify("New password has been sent to your email!")
        })
        .catch(error => {
            notify("There was an error sending your password.\n Try again later!")
        })
    }

    return (
        <div className="log-container w-screen h-screen flex flex-col" style={{backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>    
            <Navbar isLogged={false} loginScreen={true} />
            <div className="flex flex-col items-center h-full">
                <div className="log-box">
                    <div className="pt-5 select-none">
                        <p className="text-5xl font-bold font-exo text-white"> Log In to Echobond </p>
                    </div>
                    <div className="m-4">
                        <div className="h-fit py-2 px-5">
                            <form className="flex flex-col justify-center items-center pt-10 gap-2" onSubmit={logIn}>
                                <div className="pb-3 w-fit"> 
                                <input
                                    className="h-10 w-64 rounded-full select-none pl-4 font-exo text-md focus:outline-none border-2 border-gray-500 hover:border-2 hover:border-purple-200 focus:border-2 focus:border-purple-200"
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={changeUsername}
                                />
                                {/* <i className="fa-icon"> <FontAwesomeIcon icon={faUser} /> </i>  */}
                                </div>
                                <div className="relative w-fit">
                                    <input
                                        className="h-10 w-64 rounded-full select-none pl-4 pr-10 text-md font-exo select-none border-2 border-gray-500 hover:border-2 hover:border-purple-200 focus:outline-none focus:border-2 focus:border-purple-200"
                                        type={passwordShown ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={password}
                                        onChange={changePassword}
                                    />
                                    <i
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                        onClick={showPassword}
                                    >
                                        <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} className="cursor-pointer" />
                                    </i>
                                </div>
                                <ErrorMessage error={error} />
                                {/* Submit button */}
                                <input type="submit" className="text-white font-nunito w-fit rounded-xl bg-purple-200 hover:bg-purple-300 px-5 py-1.5 mt-7 select-none cursor-pointer" value="Log In" />
                                
                                <div className="flex flex-row mt-2">
                                    <button onClick={forgotPassword} className="outline-none bg-transparent underline text-white font-exo font-bold hover:text-purple-200 cursor-pointer"> Forgot Password </button>
                                </div>
                                <hr className="h-1 border-1 border-purple-300 w-full mt-4" />
                                <div className="flex flex-row mt-1">
                                    <p className="text-white text-md font-exo"> If you are not already a member </p>
                                    <button onClick={navigateRegister} className="ml-3 outline-none bg-transparent underline text-white hover:text-purple-200 font-exo font-bold"> Sign up </button>
                                    <ToastContainer />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login
