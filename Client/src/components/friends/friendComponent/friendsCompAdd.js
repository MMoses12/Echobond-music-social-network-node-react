// Basic imports.
import React from "react"
import { useNavigate } from "react-router-dom";

// Import axios for requests.
import axios from "axios";

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

function FriendsCompAdd (props) {
    const navigate = useNavigate()
    
    // Accept friend request.
    const acceptFriend = () => {
        // Decrease friend request number.
        props.setRequestNotification(props.requests - 1)

        const accessToken = localStorage.getItem('accessToken')
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        // IP with tailscale.
        axios.post("http://localhost:4000/user/confirm-friend", { usernameSec: props.name })
        .then(response => {     
            props.setFriendChange(!props.friendChange)
        })
        .catch(error => { 
            const refreshToken = localStorage.getItem('refreshToken')
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`
            
            axios.get("http://localhost:4000/token/refresh-token")
            .then(response => {
                // Store new access token.
                localStorage.setItem("accessToken", response.data.accessToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                // Retry the request.
                axios.post("http://localhost:4000/user/confirm-friend", { usernameSec: props.name })
                .then(response => {     
                    props.setFriendChange(!props.friendChange)
                })
            })
            .catch(error => {
                // Navigate to home page to login again.
                navigate("/", { replace: true })
            })
        })
    }

    // Decline friend request.
    const declineFriend = () => {
        // Decrease friend request number.
        props.setRequestNotification(props.requests - 1)

        const accessToken = localStorage.getItem('accessToken')
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        // IP with tailscale.
        axios.post("http://localhost:4000/user/decline-request", { usernameSec: props.name })
        .then(response => {
            props.setFriendChange(!props.friendChange)
        })
        .catch(error => { 
            const refreshToken = localStorage.getItem('refreshToken')
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`
            
            axios.get("http://localhost:4000/token/refresh-token")
            .then(response => {
                // Store new access token.
                localStorage.setItem("accessToken", response.data.accessToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                // Retry the request.
                axios.post("http://localhost:4000/user/decline-request", { usernameSec: props.name })
                .then(response => {        
                    props.setFriendChange(!props.friendChange)
                })
            })
            .catch(error => {
                // Navigate to home page to login again.
                navigate("/", { replace: true })
            })

            props.setFriendChange(!props.friendChange)
        })
    }

    return(
        <div className="flex flex-row select-none rounded-md h-full gap-4 align-center items-center w-full py-2">
            {props.icon ?
                <div className="h-10 w-10 ml-5 rounded-full">
                    <img src={props.icon} alt={props.name} className="h-full w-full rounded-full" />
                </div>
                :
                <div className="bg-gradient-to-r from-purple-200 to-blue-200 flex justify-center items-center border-2 border-black-500 rounded-full h-10 w-10 ml-5">
                    <FontAwesomeIcon icon={faUser} className="text-lg text-white" />
                </div>
            }
            <div className="flex flex-col">
                <p>{props.name}</p>
                <div className="flex flex-row gap-2">
                    <button className="text-white bg-purple-900 rounded-md pl-1 pr-1 cursor-pointer hover:bg-purple-300" onClick={acceptFriend}> Accept </button>
                    <button className="text-white ml-1 bg-gray-700 rounded-md pl-1 pr-1 cursor-pointer hover:bg-gray-200" onClick={declineFriend}> Reject </button>
                </div>
            </div>
        </div>
    )
}
export default FriendsCompAdd;