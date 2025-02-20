// Basic imports.
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Import axios for requests.
import axios from 'axios';

// Token decode.
import { jwtDecode } from 'jwt-decode';

// Import context from musicHome.
import { RenderContext } from '../../Pages/musicHome';

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons';

// Component imports.
import MessageBar from '../chat/messagebar';
import Message from '../chat/message';

function Chat (props) {
    const { socket } = useContext(RenderContext)
    const [username, setUsername] = useState('')
    const [messages, setMessages] = useState([])
    const [id, setID] = useState()

    const messagesEndRef = useRef(null)
    const navigate = useNavigate()

    // Get user's view to the last message.
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView();
    }

    // Open sockets for listening to / sending messages.
    const openSockets = (conversationID) => {
        setID(conversationID);

        socket.emit('conversation', conversationID);

        // Update a separate state variable to force re-render.
        const messageHandler = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        // Set up socket event listener.
        socket.off('message')
        socket.on('message', messageHandler)
    }

    // Get username from the token.
    const getUsernameFromToken = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            return null;
        }
    
        try {
            const decodedToken = jwtDecode(accessToken)
            return decodedToken.username; // Assuming the username is stored in the token under 'username'
        } catch (error) {
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://localhost:4000/token/refresh-token")
            .then(response => {
                localStorage.setItem("accessToken", response.data.accessToken)
                const decodedToken = jwtDecode(response.data.accessToken)
            
                return decodedToken.username; // Assuming the username is stored in the token under 'username'
            })
            .catch(error => {
                navigate("/", { replace: true })
            })
            
            return null;
        }
    }    

    // Clean messages and disconnect from room
    // when friend's conversation is changing.
    useEffect(() => {
        setMessages([])
        if (id) {
            socket.emit('leaveChat', id)
        }
    }, [props.friendsName])

    // Make request to get conversationID and connect to 
    // a room with the specific friend.
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        axios.post('http://localhost:4000/chat/get-conversation-id', { friend: props.friendsName })
            .then((response) => {
                setMessages([])
                openSockets(response.data.conversationID)
                setUsername(getUsernameFromToken)
            })
            .catch(error => {        
                const refreshToken = localStorage.getItem('refreshToken');
                axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

                axios.get("http://localhost:4000/token/refresh-token")
                .then(response => {
                    localStorage.setItem("accessToken", response.data.accessToken)   
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

                    axios.post('http://localhost:4000/chat/get-conversation-id', { friend: props.friendsName })
                    .then(response => {
                        setMessages([])
                        openSockets(response.data.conversationID)
                        setUsername(getUsernameFromToken)
                    })
                })
                .catch(error => {
                    navigate("/", { replace: true })
                })
            });
    }, [props.friendsName]);

    // When messages change scroll to bottom.
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Go to main page.
    const musicHome = () => {
        if (props) {
            props.setChangeTo('All')
            props.setChoice('mainSpace');
        }
    };

    return (
        <div className="flex flex-col text-white h-full w-full rounded-3xl">
            <div className="flex flex-row gap-4 items-center text-xl ml-4 pt-4">
                <FontAwesomeIcon icon={faArrowLeft} className="cursor-pointer" onClick={musicHome} />
                {props.friendImage ?
                    <img src={props.friendImage} className='h-12 w-12 rounded-full ml-4' />
                    :
                    <div className="bg-gradient-to-r from-purple-200 to-blue-200 flex justify-center items-center border-2 border-black-500 rounded-full h-12 w-12 ml-5">
                        <FontAwesomeIcon icon={faUser} className="text-xl text-white" />
                    </div>
                }
                <p> {props.friendsName} </p>
            </div>
            <div className="mt-4 h-4/5 w-4/6 mx-auto overflow-y-auto">
                {messages &&
                    messages.map((message, index) => (
                        <Message 
                            key={index} 
                            message={message} 
                            image={props.friendImage} 
                            username={username} 
                        />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="py-5 rounded-b-3xl w-full mb-12">
                <MessageBar conversationID={id} username={username} />
            </div>
        </div>
    );
}

export default Chat;
