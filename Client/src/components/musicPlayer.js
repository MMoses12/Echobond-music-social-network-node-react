// Basic imports.
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Import axios for requests.
import axios from "axios";

// Token decoder.
import { jwtDecode } from 'jwt-decode';

// Import context from 
import { RenderContext } from "../Pages/musicHome";

// Component imports.
import MusicBar from "./musicBar";
import AudioBar from "./audioBar";

function MusicPlayer (songInfo) {
    const [song, setSong] = useState()
    const [songImage, setSongImage] = useState()
    const [songTitle, setSongTitle] = useState()
    const [songArtist, setSongArtist] = useState()
    const audioRef = useRef(null)

    const navigate = useNavigate()

    const { socket } = useContext(RenderContext)

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

    useEffect(() => {
        setSongImage(songInfo.image)
        setSongArtist(songInfo.artist)
        setSongTitle(songInfo.title)
    }, [songInfo])

    // Get the requested song from the database.
    useEffect(() => {
        if (songTitle) {
            const username = getUsernameFromToken()

            // Update a separate state variable to force re-render.
            const audioHandle = (data) => {
                console.log(data);
                const blob = new Blob([data], { type: 'audio/mp3' });
                const url = URL.createObjectURL(blob);
                setSong(url);
            };

            socket.emit('listenSong', username, songTitle)

            socket.on('getSong', audioHandle)
        }
    }, [songTitle]);    

  return (
    <div className="fixed bottom-0 w-full h-24 bg-black-200 flex items-center justify-between">
      <div className="flex flex-row items-center ml-5">
        { songImage ? <img src={songImage} className="w-16 select-none" alt="Album Cover" /> : <div className="ml-36"> </div> }
        <div className="flex flex-col justify-center items-start pl-3">
            <h3 className="text-white text-md font-exo cursor-pointer hover:underline select-none"> {songTitle} </h3>
            <p className="text-gray-200 text-sm font-exo cursor-pointer hover:underline select-none"> {songArtist} </p>
        </div>
      </div>
      <div className="flex justify-center items-center w-1/3">
        <MusicBar 
            audioRef={audioRef} 
            song={song} 
            setSongTitle={setSongTitle}
            setSongImage={setSongImage}
            setSongArtist={setSongArtist}
            songTitle={songTitle}
        />
      </div>
      <div className="mr-20"> <AudioBar audio={audioRef} /> </div>
    </div>
  );
}

export default MusicPlayer;
