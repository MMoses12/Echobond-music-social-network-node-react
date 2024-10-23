// Basic impoort.
import React from "react";

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function AlbumSongs (props){
    return (
        <div>
            <div className="text-white text-3xl ml-10 cursor-pointer">
                <FontAwesomeIcon icon={faArrowLeft}/>
            </div> 
            <div className="text-white font-exo text-3xl ml-20 h-full">
                {props.title}
            </div>
        </div>
    )
}

export default AlbumSongs;