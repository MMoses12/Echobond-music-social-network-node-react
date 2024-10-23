// Basic imports.
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Import axios for requests.
import axios from "axios"

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

// Component imports.
import FriendsCompAdd  from "./friendComponent/friendsCompAdd"
import FriendSuggestion from "./friendComponent/friendSuggestions"

// For toast.
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FriendsAdd (props) {
    const [friendRequests, setFriendRequests] = useState ('')
    const [friendChange, setFriendChange] = useState(false)
    const [searchUser, setSearchUser] = useState('')
    const [recommendations, setRecommendations] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        axios.get("http://100.91.43.32:4000/user/get-friend-requests")
        .then(response => {
            setFriendRequests(response.data.requests)
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
                axios.get("http://100.91.43.32:4000/user/get-friend-requests")
                .then(response => {
                    setFriendRequests(response.data.requests)
                })
                .catch(error => {
                    navigate("/", { replace: true })
                })
            })
            .catch(error => {
                navigate("/", { replace: true })
            })
        })
    }, [friendChange])

    const friendsB = () =>{
        props.setFriendsPage("friendsBasic");
    }

    const changeSearchTerm = (event) => {
        setSearchUser(event.target.value)
    }

    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        axios.post("http://100.91.43.32:4000/user/search-friends", { friendUsername: searchUser })
        .then(response => {
            setRecommendations(response.data.searchedFriends)
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
                axios.post("http://100.91.43.32:4000/user/search-friends", { friendUsername: searchUser })
                .then(response => {
                    setRecommendations(response.data.searchedFriends)
                })
                .catch(error => {
                    navigate("/", { replace: true })
                })
            })
            .catch(error => {
                navigate("/", { replace: true })
            })
        })
    }, [searchUser, friendChange])

    return(
        <div className="flex flex-col h-full select-none">
            <div className="flex flex-row text-xl ml-5 mr-5 mt-5 mb-3">
                <div className="flex flex-row gap-2">
                    <div>
                        <FontAwesomeIcon icon={faArrowLeft} className="cursor-pointer" onClick = {()=>friendsB()}/>
                    </div>   
                    <p className="font-exo text-white">Friend requests</p>
                </div>
            </div>
            <hr className="h-1" />
            <form className="flex justify-center items-center mt-4">
                <input
                    className="pl-2 pr-10 rounded-lg text-md text-black-500 focus:outline-none w-4/4 h-6"
                    type="text"
                    placeholder="Search..."
                    value={searchUser}
                    onChange= {changeSearchTerm}
                />
            </form>
            {friendRequests &&
                <div className="flex flex-col gap-4 overflow-y-auto">
                    {friendRequests.map((friend,index) => (
                        <div key={index}>
                            <FriendsCompAdd 
                                icon = {friend.Photo}
                                name = {friend.username} 
                                setFriendChange = { setFriendChange }
                                friendChange = { friendChange }
                                requests={props.requests} 
                                setRequestNotification={props.setRequestNotification}
                            />
                        </div>
                    ))}
                </div>
            }
            <div className="flex flex-col gap-4 overflow-y-auto mt-6 ml-3">
                <h2 className="text-lg"> Add friends </h2>
                {recommendations &&
                    <div className="flex flex-col gap-4 overflow-y-auto">
                        {recommendations.map((user,index) => (
                            <div key={index}>
                                <FriendSuggestion 
                                    icon = {user.Photo}
                                    name = {user.username} 
                                    setFriendChange = { setFriendChange }
                                    friendChange = { friendChange }
                                />
                            </div>
                        ))}
                    </div>
                }
            </div>
            <ToastContainer />
        </div>
    )
}

export default FriendsAdd;