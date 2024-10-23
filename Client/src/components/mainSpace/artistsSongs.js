// Basic import.
import React from "react";

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function ArtistsSongs (props){
    return (
        <div>
            <div className="text-white text-3xl ml-10 cursor-pointer">
                <FontAwesomeIcon icon={faArrowLeft}/>
            </div> 
            <div className="text-white font-exo text-3xl ml-20 h-full">
                {props.name}
            </div>
        </div>
    )
}

export default ArtistsSongs;