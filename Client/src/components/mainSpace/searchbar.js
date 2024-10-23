// Basic import.
import React, { useState } from "react"

// Component imports.
import SearchIdle from "../searchComponent/searchIdle.js"
import SearchHandler from "../searchComponent/searchHandler.js"

function Search (props, { data, onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [choice, setChoice] = useState('SearchIdle');
    const [trigger, setTrigger] = useState(false);

    const handleChange = (event) => {
          setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        setTrigger(!trigger);
        setChoice('SearchHandler');
    };

    const renderComponent = () => {
        switch (choice) {
            //avoid error if its called from mainspace and not here
            case 'Artists' :
            case 'Albums' :
            case 'SearchIdle' : 
                return <SearchIdle setChoice={setChoice} 
                        setChangeTo={props.setChangeTo} 
                        setMainSpace={props.setChoice} 
                        setSelectedAlbum={props.setSelectedAlbum} 
                        setSelectedArtist={props.setSelectedArtist}
                    />;
            case 'SearchHandler' :
                return <SearchHandler value = {searchTerm} setchangeTo={props.setChangeTo} 
                        setMainSpace={props.setChoice} 
                        trigger = {trigger} 
                        setChoice={setChoice} 
                        setChangeTo={props.setChangeTo}
                        setSelectedAlbum={props.setSelectedAlbum} 
                        setSelectedArtist={props.setSelectedArtist}
                    />
            default:
                return null;
        }
    }

    return (
        <div className="flex flex-col h-full w-full">
            <div className="text-white text-lg justify-center items-center text-center mt-12">
                <div className="flex justify-center">
                    <div className="relative flex justify-center items-center w-full">
                        <input
                            className="pl-2 pr-10 rounded-3xl text-md text-black-500 focus:outline-none w-2/5 h-10"
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange= {handleChange}
                        />
                        <button
                            onClick={handleSearch} 
                            className="bg-transparent text-black-500 text-2xl px-3 hover:text-purple-800 hover:text-3xl"
                            style={{ position: 'absolute', right: '30%', top: '50%', transform: 'translateY(-50%)' }}
                            >
                            ⌕
                        </button>
                    </div>
                </div>
            </div>
            <div className="h-5/6  rounded-3xl mr-4 ml-4 mt-4">
                {renderComponent()}
            </div>
        </div>
    )
}

export default Search;
