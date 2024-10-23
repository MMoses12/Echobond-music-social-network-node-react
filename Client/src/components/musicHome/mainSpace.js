// Basic imports.
import React, { useState, useEffect } from "react";

// Component imports.
import Albums from "../mainSpace/album";
import Artists from "../mainSpace/artists";
import Favorites from "../mainSpace/favorites";
import All from "../mainSpace/all";
import AlbumSongs from "../albumComponent/albumSongs";
import ArtistsSongs from "../artistsComponent/artistsSongs";

function MainSpace (props) {
    const [choice , setChoice] = useState("All");
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedArtist, setSelectedArtist] = useState(null);

    // Get choice.
    useEffect(() => {
        setChoice(props.current)
    },[props.current])

    // Get current album
    useEffect(() =>{
        setSelectedAlbum(props.currentAlbum)
    },[props.currentAlbum])

    // Get current artist.
    useEffect(() =>{
        setSelectedArtist(props.currentArtist)
    },[props.currentArtist])


    // Handle new choice.
    const handleChoice = (items) =>{
        setChoice(items);
    }

    const renderComponent = () => {
        switch (choice) {
            case 'Albums':
                return <Albums 
                    setSelectedAlbum={setSelectedAlbum} 
                    setChoice={setChoice} 
                />;
            case 'Favorites':
                return <Favorites setChoice={setChoice} setSelectedAlbum={setSelectedAlbum} setSelectedArtist={setSelectedArtist} />;
            case 'Artists':
                return <Artists setChoice={setChoice}  setSelectedAlbum={setSelectedAlbum} setSelectedArtist={setSelectedArtist} />;
            case 'All':
                return <All setChoice={setChoice} setSelectedAlbum={setSelectedAlbum} setSelectedArtist={setSelectedArtist} />;
            case 'AlbumSongs':
                return <AlbumSongs
                        image = {selectedAlbum.image}
                        name = {selectedAlbum.name}
                        artist= {selectedAlbum.artist}
                        year = {selectedAlbum.year}
                        gerne = {selectedAlbum.style}
                        setChoice={setChoice}
                />; 
            case 'ArtistsSongs':
                return <ArtistsSongs 
                    name = {selectedArtist.name}
                    image = {selectedArtist.image}
                    setSelectedAlbum={setSelectedAlbum}
                    setChoice={setChoice}
                />
            default:
                return null;
        }
    }

    return(
        <div className="flex flex-col h-full">
            <div className = "flex flex-row gap-12 text-white justify-center mt-5 mr-4 font-exo text-xl mb-6 select-none">
                <p className = "cursor-pointer" onClick={() => handleChoice("All")} style={{color:choice==="All"?"#ad56cd":"white",borderBottom: choice === "All" ? "2px solid #ad56cd" : ""}}>All</p>
                <p className = "cursor-pointer" onClick={() => handleChoice("Artists")} style={{color:choice==="Artists"?"#ad56cd":"white",borderBottom: choice === "Artists" ? "2px solid #ad56cd" : ""}}>Artists</p>
                <p className = "cursor-pointer" onClick={() => handleChoice("Albums")} style={{color:choice==="Albums"?"#ad56cd":"white",borderBottom: choice === "Albums" ? "2px solid #ad56cd" : ""}}>Albums</p>
                <p className = "cursor-pointer" onClick={() => handleChoice("Favorites")} style={{color:choice==="Favorites"?"#ad56cd":"white",borderBottom: choice === "Favorites" ? "2px solid #ad56cd" : ""}}>Favourites</p>

            </div>
            <hr className="h-1 text-white mr-16 ml-16" />
            <div className="h-5/6  rounded-3xl mr-4 ml-4 mt-4">
                {renderComponent()}
            </div>
        </div>
    )
}

export default MainSpace