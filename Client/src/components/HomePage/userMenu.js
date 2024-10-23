// Basic imports.
import React, { useState, useContext, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom";

// Import axios for requests.
import axios from "axios";

// Import context from musicHome.
import { RenderContext } from "../../Pages/musicHome";

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; 

function UserDropdownMenu () {
    const [isOpen, setIsOpen] = useState(false);
    const [userPhoto, setUserPhoto] = useState();
    const { choosePage } = useContext(RenderContext);
    const dropdownRef = useRef(null); // Ref to help detect outside clicks

    const navigate = useNavigate()

    // Toggle dropdown function
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Open account page function
    const openAccount = () => {
        choosePage('user');
        setIsOpen(false); // Close dropdown after action
    };

    // Log out function
    const logOut = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Navigate to the login page after clearing the tokens
        navigate("/", { replace: true })
    };

    // Get user's photo to display.
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        axios.get("http://100.91.43.32:4000/user/get-user-info")
        .then(response => {
            setUserPhoto(response.data.userInfo.Photo)
        })
        .catch(error => {
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`
            
            axios.get("http://100.91.43.32:4000/token/refresh-token")
            .then(response => {
                localStorage.setItem('accessToken', response.data.accessToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                axios.get("http://100.91.43.32:4000/user/get-user-info")
                .then(response => {
                    setUserPhoto(response.data.Photo)
                })
            })
        })
    })

    // Handle clicking outside the dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="relative pt-6 pr-10" ref={dropdownRef}>
            {userPhoto ? (
                <img 
                    onClick={toggleDropdown} 
                    className="rounded-full cursor-pointer hover:border-grey-500 z-10 w-10 h-10"
                    src={userPhoto}
                    alt="User Photo"
                />
            ) : (
                <FontAwesomeIcon 
                    icon={faUser} 
                    onClick={toggleDropdown}   
                    className="text-white border p-1 rounded-full cursor-pointer hover:text-grey-500 hover:border-grey-500 z-10 w-5 h-5" 
                />
            )}

            {/* Dropdown content */}
            {isOpen && (
                <div className="absolute top-full right-4 mt-2 w-48 bg-gray-500 shadow-md rounded overflow-hidden">
                    <ul className="list-none m-0">
                        <li onClick={openAccount} className="text-white hover:bg-purple-200 cursor-pointer py-2 px-4 select-none">Account</li>
                        <li className="text-white hover:bg-purple-200 cursor-pointer py-2 px-4 select-none">Playlists</li>
                        <hr className="h-1 text-white" />
                        <li onClick={logOut} className="text-white hover:bg-purple-200 cursor-pointer py-2 px-4 select-none">Log out</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default UserDropdownMenu;
