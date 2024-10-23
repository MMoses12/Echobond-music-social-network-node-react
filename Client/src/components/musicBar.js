// Basic imports.
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Import axios for requests.
import axios from 'axios';

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faShuffle, faPlay, faForwardStep, faBackwardStep, faRepeat } from '@fortawesome/free-solid-svg-icons';

// Token decoder.
import { jwtDecode } from 'jwt-decode';

// Context from musicHome.
import { RenderContext } from "../Pages/musicHome";

// Style import.
import '../styles/handle.css';

function MusicBar({ song, audioRef, setSongTitle, setSongImage, setSongArtist, songTitle }) {
    const [value, setValue] = useState(0);
    const [duration, setDuration] = useState(song ? song.duration : 0);
    const [randomSelected, setRandomSelected] = useState(false);
    const [repeatSelected, setRepeatSelected] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [playing, setPlaying] = useState(true)

    const { socket } = useContext(RenderContext)

    const navigate = useNavigate()

    // Calculate the percentage for the slider
    const percentage = duration ? (value / duration) * 100 : 0;

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

            axios.get("http://100.91.43.32:4000/token/refresh-token")
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

    // Toggle random play
    const changeRandom = () => {
        setRandomSelected(!randomSelected);
    };

    // Toggle repeat play
    const changeRepeat = () => {
        setRepeatSelected(!repeatSelected);
    };

    const getNextSong = () => {
        const username = getUsernameFromToken()
        socket.emit('nextSong', username, songTitle)

        socket.on('getNextSong', (song) => {
            setSongTitle(song.title)
            setSongImage(song.image)
            setSongArtist(song.artist)
        })
    }

    const getPreviousSong = () => {
        const username = getUsernameFromToken()

        socket.emit('previousSong', username, songTitle)

        socket.on('getPreviousSong', (song) => {
            setSongTitle(song.title)
            setSongImage(song.image)
            setSongArtist(song.artist)
        })
    }

    // Play song
    const playSong = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setPlaying(true);
        }
    };

    // Pause song
    const pauseSong = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlaying(false);
        }
    };

    // Function to fast forward or rewind
    const changeTime = (event) => {
        const newTime = parseFloat(event.target.value);
        setValue(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    // Use the timeupdate event to synchronize the value
    useEffect(() => {
        const audioElement = audioRef.current;

        const handleTimeUpdate = () => {
            setValue(audioElement.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(audioElement.duration);
            setValue(0);
        };

        const handleEnded = () => {
            if (repeatSelected) {
                audioElement.currentTime = 0;
                audioElement.play();
            }
        };

        if (audioElement) {
            audioElement.addEventListener('timeupdate', handleTimeUpdate);
            audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
            audioElement.addEventListener('ended', handleEnded);

            // Clean up event listeners on component unmount
            return () => {
                audioElement.removeEventListener('timeupdate', handleTimeUpdate);
                audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audioElement.removeEventListener('ended', handleEnded);
            };
        }
    }, [audioRef, repeatSelected]);

    // Handle song change and play immediately
    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement && song) {
            // Pause the audio before changing the source
            audioElement.pause();
            setPlaying(false);

            // Set the new source and load it
            audioElement.src = song;
            audioElement.load();

            // Play the new song once it's loaded
            const playNewSong = () => {
                audioElement.play();
                setPlaying(true);
            };

            audioElement.addEventListener('loadeddata', playNewSong);

            // Clean up event listener
            return () => {
                audioElement.removeEventListener('loadeddata', playNewSong);
            };
        }
    }, [song, audioRef]);

    // Convert seconds to MM:SS format
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Updated sliderStyle to correctly reflect the initial appearance and dynamic changes
    const sliderStyle = {
        background: isHovered
            ? `linear-gradient(to right, #9818d6 ${percentage}%, #393e46 ${percentage}%)`
            : `linear-gradient(to right, white ${percentage}%, #393e46 ${percentage}%)`,
        cursor: 'pointer',
        appearance: 'none',
        width: '100%',
        height: '4px',
        borderRadius: '9999px',
    };

    return (
        <div className='flex flex-col w-full justify-center items-center'>
            <div className='flex flex-row w-full justify-center items-center gap-5'>
                <FontAwesomeIcon className={`${randomSelected ? 'text-purple-200' : 'text-gray-200'} w-5 h-5 cursor-pointer select-none`} icon={faShuffle} onClick={changeRandom} />
                <FontAwesomeIcon className='text-gray-200 hover:text-white w-5 h-5 cursor-pointer select-none' icon={faBackwardStep} onClick={getPreviousSong} />
                <div className='relative'>
                    <div className='absolute bg-purple-400 w-8 h-8 rounded-full p-2 flex justify-center items-center' style={{ top: '-16px' }}>
                        {playing ?
                            <FontAwesomeIcon className='text-white w-5 h-5 cursor-pointer select-none' icon={faPause} onClick={pauseSong} />
                            :
                            <FontAwesomeIcon className='text-white w-4 h-4 pl-0.5 cursor-pointer select-none' icon={faPlay} onClick={playSong} />
                        }
                    </div>
                </div>
                <div className='ml-3'> </div> {/* Make space between two icons */}
                <FontAwesomeIcon className='text-gray-200 hover:text-white w-5 h-5 cursor-pointer select-none' icon={faForwardStep} onClick={getNextSong} />
                <FontAwesomeIcon className={`${repeatSelected ? 'text-purple-200' : 'text-gray-200'} w-5 h-5 cursor-pointer select-none`} icon={faRepeat} onClick={changeRepeat} />
            </div>
            <div className="flex flex-row w-full mt-5 px-4">
                <audio ref={audioRef} />
                <p className="text-gray-200 font-exo text-sm w-3 mr-6"> {formatTime(value)} </p>
                <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={value}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onChange={changeTime}
                    style={sliderStyle}
                    className='slider-thumb mt-2.5 w-full'
                />
                <p className="text-gray-200 font-exo text-sm w-3 ml-3"> {formatTime(duration)} </p>
            </div>
        </div>
    );
}

export default MusicBar;
