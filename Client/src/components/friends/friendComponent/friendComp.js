// Basic imports.
import React,{ useState } from "react"
import { useNavigate } from "react-router-dom"

// Import axios for requests.
import axios from "axios"

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faTrash } from '@fortawesome/free-solid-svg-icons' 

function FriendsComp(props){
    const [isHovered, setIsHovered] = useState(false)
    const navigate = useNavigate()

    // Delete friend request.
    const deleteFriend = (friend) => {
        const accessToken = localStorage.getItem('accessToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        // IP with tailscale.
        axios.delete("http://localhost:4000/user/remove-friend?friend=" + friend)
        .then(response => {
            props.setFriendsChange(!props.friendChange)
        })
        .catch(error => {
            const refreshToken = localStorage.getItem("refreshToken")
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            // Retry the request.
            axios.get("http://localhost:4000/token/refresh-token")
            .then(response => {
                localStorage.setItem('accessToken', response.data.accessToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                axios.delete("http://localhost:4000/user/remove-friend?friend=" + friend)
                .then(response => {
                    props.setFriendsChange(!props.friendChange)
                })
            })
            .catch(error => {
                navigate("/login", { replace: true })
            })
        })
    }

    return(
        <div 
            className="flex flex-row cursor-pointer select-none hover:bg-purple-transparent rounded-md h-full gap-4 align-center items-center py-2"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
        >
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
                <div>    
                    <p>{props.name}</p>
                </div>
                <div className="">
                {isHovered &&
                    <FontAwesomeIcon icon={faTrash} 
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteFriend(props.name);
                        }}  
                        className="text-md text-white hover:text-red-200" 
                    />
                }
            </div>
            </div>
        </div>
    )
}
export default FriendsComp;