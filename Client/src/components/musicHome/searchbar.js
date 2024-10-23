// Basic import.
import React, { useState } from "react";

// Import icons.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

function SearchBar(props) {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [ShowMainSpace, setShowMainSpace] = useState(false);
  
    const handleSearchButtonClick = () => {
        // Update the prop.render state to 'searchMainSpace' when Search button is clicked
        props.setChoice ("searchMainSpace");
        // Show the search bar
        setShowSearchBar(true);
    };
    
    const handleHomeButtonClick = () => {
        props.setChoice ("mainSpace");
        props.setChangeTo("All")
        setShowMainSpace(true);
    }

    return (
        <div className="text-white flex flex-col text-lg justify-start items-start ml-12">
            <div className="mt-5 pb-2 " onClick={handleHomeButtonClick}>
                <p className="font-exo cursor-pointer"><FontAwesomeIcon icon={faHouse} className="mr-4" />Home</p>
            </div>
            <div className="flex flex-row cursor-pointer">
                <button onClick={handleSearchButtonClick} className="mr-3.5 text-3xl">⌕</button>
                <button className="font-exo" onClick={handleSearchButtonClick}>Search</button>
            </div>
        </div>
    );
}

export default SearchBar;