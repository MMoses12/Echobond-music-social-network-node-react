// Basic imports.
import React, { useState } from "react"

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp, faVolumeMute, faVolumeDown } from '@fortawesome/free-solid-svg-icons'

// Style import.
import "../styles/handle.css"

// Bar in the MusicPlayer component for volume up or down.
function AudioBar (audio) {
    const [volume, setVolume] = useState(1)
    const [isHovered, setIsHovered] = useState(false)

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value)
        setVolume(newVolume)
        if (audio.audio.current) {
            audio.audio.current.volume = newVolume
        }
    }

    // Updated sliderStyle to correctly reflect the initial appearance and dynamic changes
	const sliderStyle = {
        background: isHovered ?
        `linear-gradient(to right, #9818d6 ${volume * 100}%, #393e46 ${volume * 100}%)` : // Purple to gray on hover
        `linear-gradient(to right, white ${volume * 100}%, #393e46 ${volume * 100}%)`, // White when not hovered
        cursor: 'pointer',
        appearance: 'none',
        width: '100%',
        height: '4px',
        borderRadius: '9999px',
    }

    const chooseIcon = () => {
        if (volume === 0)
            return faVolumeMute
        else if (volume > 0 && volume <= 0.5)
            return faVolumeDown
        else 
            return faVolumeUp
    }

    return (
        <div className="w-full flex flex-row items-end h-full gap-3">
            <div className="self-center mt-10 w-4 h-6.5">    
                <FontAwesomeIcon icon={chooseIcon()} className="text-gray-200 text-md" />
            </div>
            <div className="self-center mt-8">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onChange={handleVolumeChange}
                    style={sliderStyle}
                    className="slider-thumb"
                />
            </div>                
        </div>
    )
}

export default AudioBar