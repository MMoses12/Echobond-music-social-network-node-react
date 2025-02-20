// Basic imports.
import React,{ useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import axios for requests.
import axios from "axios"

// Component imports.
import FriendsComp from "./friendComponent/friendComp";

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

function FriendsBasic (props) {
    const [friends, setFriends] = useState ('')
    const [friendsChange, setFriendsChange] = useState(false)
    const navigate = useNavigate()

    // Get all user's friends.
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        // IP with tailscale.
        axios.get("http://localhost:4000/user/get-friends")
        .then(response => {
            setFriends(response.data.friends)
        })
        .catch(error => {
            const refreshToken = localStorage.getItem("refreshToken")
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            // Retry the request.
            axios.get("http://localhost:4000/token/refresh-token")
            .then(response => {
                localStorage.setItem('accessToken', response.data.accessToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                axios.get("http://localhost:4000/user/get-friends")
                .then(response => {
                    setFriends(response.data.friends)
                })
            })
            .catch(error => {
                navigate("/login", { replace: true })
            })
        })
    }, [friendsChange])
    
    // Change to friend request.
    const addFriends = () => {
        props.setFriendsPage("friendsAdd");
    }

    // Open the chat.
    const openChat = (friend) => {
        props.setRender("chat")
        props.setFriend(friend)
    }

    return(
        <div className="flex select-none flex-col h-full">
            <div className="flex flex-row text-xl ml-5 mr-5 mt-5 mb-4">
                <p className="font-exo text-white"> Friends </p>   
                <div className="relative ml-auto mt-1">
                    <FontAwesomeIcon 
                        icon={faUserPlus} 
                        className="text-white cursor-pointer text-lg" 
                        onClick={() => addFriends()} 
                    />
                    <div 
                        className="bg-orange h-4 w-4 rounded-full flex justify-center items-center absolute" 
                        style={{ top: "-10px", right: "-5px" }}
                    >
                        <p className="text-xs font-bold"> {props.requests} </p>
                    </div>
                </div>
            </div>
            <hr className="h-1" />
            {friends &&
                <div className="text-white flex flex-col gap-4 overflow-y-auto mb-16">
                    {friends.map((friend,index) => (
                        <div key={index} onClick={() => openChat(friend)}>
                            <FriendsComp 
                                icon = {friend.Photo}
                                name = {friend.username}
                                friendsChange = {friendsChange}
                                setFriendsChange = {setFriendsChange}
                            />
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default FriendsBasic;