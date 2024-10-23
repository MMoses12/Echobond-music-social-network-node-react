// Basic import.
import React,{ useState, useContext } from "react";

// Import context from musicHome to get variables.
import { RenderContext } from "../../Pages/musicHome"

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

function Song (props){
    const [isHovered, setIsHovered] = useState(false);
    const { setSongPlaying } = useContext(RenderContext)

    const handleSongClick = (song) => {
        setSongPlaying(song)
    }
    

    return(
        <div className="h-20 w-full relative hover:bg-purple-transparent pl-2 pt-2 rounded-xl select-none cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => handleSongClick(props)}>
            <div className="flex flex-row justify-between">
                <div className="w-16">
                    <img src={props.image} className="h-16 w-16 rounded-xl "/>
                </div>
                {isHovered && (
                    <div className="absolute inset-0 flex justify-start ml-8 place-self-middle mr-52 bg-black bg-transparent rounded-xl">
                        <button className="text-white text-3xl">
                            <i className="fas fa-play"></i>
                        </button>
                    </div>
                )}
                <div className="ml-4 ">
                    <div className="flex flex-col">
                        <p className="mt-2 text-white">{props.name}</p>
                        <p className="mt-1 text-gray-200">{props.artist}</p>
                    </div>
                </div>
                <div className="flex items-center ml-auto pr-4">
                    <div >
                        <p className="text-white ml-6 pr-3">{props.time}</p>
                    </div>
                    <div className="ml-auto flex my-auto  text-white cursor-pointer w-6">
                        {isHovered && (
                            <FontAwesomeIcon icon={faEllipsisVertical} className="hover:text-gray-200" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Song