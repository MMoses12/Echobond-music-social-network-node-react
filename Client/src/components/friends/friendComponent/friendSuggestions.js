// Basic imports.
import React from "react"
import  { useNavigate } from "react-router-dom"

// Import axios for requests.
import axios from "axios";

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faAdd } from '@fortawesome/free-solid-svg-icons' 

// For toast.
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FriendSuggestion (props) {
    const navigate = useNavigate()

    // Make a new toast to notify user.
    const notify = (message) => {
        toast(message)
    }

    // Add new friend request.
    const addFriend = () => {
        const token = localStorage.getItem("accessToken")
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        axios.post("http://100.91.43.32:4000/user/add-friend", { friendRequest: props.name })
        .then(response => {
            notify("Request sent to " + props.name)  
            props.setFriendChange(!props.friendChange)
        })
        .catch(error => {
            const refreshToken = localStorage.getItem("refreshToken")
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://100.91.43.32:4000/token/refresh-token")
            .then(response => {
                // Store token and set it as header.
                localStorage.setItem("accessToken", response.data.accessToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                // Retry the request.
                axios.post("http://100.91.43.32:4000/user/add-friend", { friendRequest: props.name })
                .then(response => {
                    notify("Request sent to " + props.name)  
                    props.setFriendChange(!props.friendChange)
                })
                .catch(error => {
                    console.log(error)
                    navigate("/", { replace: true })
                })
            })
            .catch(error => {
                navigate("/", { replace: true })
            })
        })
    }

    return(
        <div className="flex flex-row select-none hover:bg-purple-transparent rounded-md h-full gap-4 align-center items-center w-full py-2">
            {props.icon ?
                <div className="h-10 w-10 ml-5 rounded-full">
                    <img src={props.icon} alt={props.name} className="h-full w-full rounded-full" />
                </div>
                :
                <div className="bg-gradient-to-r from-purple-200 to-blue-200 flex justify-center items-center border-2 border-black-500 rounded-full h-10 w-10 ml-5">
                    <FontAwesomeIcon icon={faUser} className="text-lg text-white" />
                </div>
            }
            <div className="flex flex-row justify-between w-1/2">
                <div className="">    
                    <p> {props.name} </p>
                </div>
                <div className="">
                    <FontAwesomeIcon icon={faAdd} onClick={addFriend} className="text-lg text-white ml-1 cursor-pointer hover:text-gray-200 mt-1" />
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
export default FriendSuggestion