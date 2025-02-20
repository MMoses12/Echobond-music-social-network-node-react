// Basic imports.
import React, { useState, createContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";

// Socket import.
import { io } from "socket.io-client"

// Token decoder.
import { jwtDecode } from 'jwt-decode';

// Component imports.
import Friends from "../components/musicHome/friends.js";
import Navbar from "../components/HomePage/navbar.js";
import SearchBar from "../components/musicHome/searchbar.js";
import MainSpace from "../components/musicHome/mainSpace.js";
import Chat from "../components/mainSpace/chat.js";
import SearchMainSpace from "../components/mainSpace/searchbar.js";
import MusicPlayer from "../components/musicPlayer.js";

// Page import.
import User from "./User.js";

// For toast.
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Make context to send vars to other components.
export const RenderContext = createContext();

const MusicHome = () => {
    const [choice, setChoice] = useState("mainSpace");
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [friend, setFriend] = useState()
    const [socket, setSocket] = useState();
    const [songPlaying, setSongPlaying] = useState('')
    const [changeTo, setChangeTo] = useState('All')

    const [requestNotification, setRequestNotification] = useState(0)

    const navigate = useNavigate()

    // Notify user.
    const notify = (message) => {
        toast(message)
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
            navigate("/", { replace: true })
        }
    }    

    // Start socket connections.
    useEffect(() => {
        // IP with tailscale.
        const socketInstance = io("http://localhost:4001");

        socketInstance.on("connect", () => {
            console.log("Connected to server!");
        });

        const username = getUsernameFromToken()

        socketInstance.emit("join", username)

        socketInstance.on("friendRequest", (request) => {
            notify(request + " sent you a friend request")
            setRequestNotification(requestNotification + 1)
        })

        socketInstance.on('requests', (requestNumber) => {
            if (requestNumber !== 0)    
                notify("You have " + requestNumber + " new friend requests")
            setRequestNotification(requestNumber)
        })

        socketInstance.on('newMessage', (from, message) => {
            notify("You have new message from " + from + "\n" + message)
        })

        setSocket(socketInstance);

        return (() => {
            socketInstance.emit('disconnectUser', username)
        })
    }, []);

    // Render multiple pages.
    const choosePage = (page) => {
        setChoice(page);
    };

    const renderComponent = () => {
        switch (choice) {
            case "mainSpace":
                return <MainSpace 
                    current={changeTo} 
                    currentAlbum={selectedAlbum} 
                    currentArtist = {selectedArtist}
                    setSelectedAlbum={setSelectedAlbum} 
                    setSelectedArtist={setSelectedArtist}
                />;
            case "Artists":
            case "Albums":
            case "searchMainSpace":
                return (
                    <SearchMainSpace
                        setChoice={setChoice}
                        setSelectedAlbum={setSelectedAlbum}
                        setSelectedArtist={setSelectedArtist}
                        setChangeTo={setChangeTo}
                    />
                );
            case "chat":
                return <Chat friendsName={friend.username} friendImage={friend.Photo} setChoice={setChoice} socket={socket} setChangeTo={setChangeTo} />;
            case "user":
                return <User />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-2 h-screen w-screen bg-black-500">
                <div class="top-div">
                    <RenderContext.Provider value={{ choice, choosePage }}>
                        <Navbar isLogged={true} />
                    </RenderContext.Provider>
                </div>
                <div class="flex flex-row rounded-full gap-4 h-5/6 w-6/6 ml-6 mr-6 ">
                    <div class="flex flex-col gap-4 w-1/6">
                        <div class="text-center rounded-xl h-1/5 bg-gradient-to-b from-start to-end shadow-lg" style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(153, 50, 204, 0.5)' }}>
                            <SearchBar setChoice={setChoice} setChangeTo={setChangeTo} />
                        </div>
                        <div class="rounded-xl h-4/5 bg-purple-300 bg-gradient-to-b from-start to-end shadow-lg" style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(153, 50, 204, 0.5)' }}>
                            <Friends setChoice={setChoice} setFriend={setFriend} requests={requestNotification} setRequestNotification={setRequestNotification} />
                        </div>
                    </div>
                    <div class=" flex-1 rounded-3xl bg-gradient-to-b from-start to-end shadow-lg" style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(153, 50, 204, 0.5)' }} >
                        <RenderContext.Provider value={{ socket, setSongPlaying }}>
                            {renderComponent()}        
                        </RenderContext.Provider>
                    </div>
                </div>
            </div>
            <div>
                <RenderContext.Provider value={{ socket }}>
                    <MusicPlayer 
                        artist={songPlaying.artist}
                        title={songPlaying.name}
                        image={songPlaying.image}
                    />
                </RenderContext.Provider>
                <ToastContainer />
            </div>
        </div>
    );
};

export default MusicHome;
