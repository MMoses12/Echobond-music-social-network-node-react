// Basic imports.
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Import axios for requests.
import axios from 'axios'

// Import photos.
import Background from "../Photos/LogIn.jpg"

// For toast.
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OtpPage = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const otpInputs = [useRef(), useRef(), useRef(), useRef()];

    const navigate = useNavigate()
    const location = useLocation()

    let email = location.state.email
    let password = location.state.password
    let username = location.state.username

    // Notify user.
    const notify = (message) => {
        toast(message)
    }

    // Get the otp from inputs.
    const handleOtpChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, ''); // Allow only digits
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to the next input
        if (value !== '' && index < otp.length - 1) {
        otpInputs[index + 1].current.focus();
        }
    };

    // Send otp to server.
    const handleVerifyClick = () => {
        const enteredOtp = otp.join('');

        // Check if there are the data or user
        // pressed submit button.
        if (!enteredOtp) {
            return 
        }

        // IP with tailscale.
        axios.put("http://100.91.43.32:4000/user/register", { username, password, email, insertedOTP: enteredOtp })
        .then(response => {
            navigate("/login", { replace: true })
        })
        .catch(error => {
            console.log(error)
        })
    }

    // Send credentials to the server.
    const resendOTP = (event) => {
        // IP with tailscale.
        axios.post("http://100.91.43.32:4000/otp/send-otp", { username, email, register: true })
            .then(response => {
                notify("OTP resent successfully!")
            })
            .catch(error => {
                console.log("Error sending OTP", error);
            });
    };

    return (
        <div className='flex justify-center bg-gradient-to-b from-start to-end h-screen w-screen' style={{backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="flex flex-col gap-8 bg-wtrans1 rounded-3xl justify-center items-center pt-12" style={{width:"400px" , height:"400px "}}>
                <h2 className='text-white font-nunito text-5xl font-bold select-none'> Enter 4-digit OTP </h2>
                <div className="flex flex-row items-center gap-14 mt-8">
                {otp.map((digit, index) => (
                    <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)} 
                    className='w-10 h-14 rounded-md text-center text-2xl border-transparent focus:outline-none hover:border-2 hover:border-purple-200'
                    ref={otpInputs[index]}
                    />
                ))}
                </div>
                <div className="flex flex-row gap-4">
                    <p className='text-white font-exo'> Didn't find the OTP? </p>
                    <button className='outline-none bg-transparent underline text-white hover:text-purple-200 font-exo font-bold' onClick={resendOTP}> Resend OTP </button>
                </div>
                <button className="text-white font-nunito w-fit rounded-xl bg-purple-200 hover:bg-purple-300 px-5 py-1.5 mt-7 select-none cursor-pointer" onClick={handleVerifyClick}> 
                    Verify OTP 
                </button>
                <ToastContainer />
            </div>
        </div>
    );
};

export default OtpPage;
