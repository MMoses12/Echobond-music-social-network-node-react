// Basic imports.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import axios for requests.
import axios from "axios";

// React spinner.
import { ClipLoader } from 'react-spinners';

// Component imports.
import Artists from '../artistsComponent/artistsComponent';
import Albums from '../albumComponent/albumComponent'


function Favorites(props) {
    const [favouriteAlbums, setfavouriteAlbums] = useState([]);
    const [isLoading,setIsLoading] = useState();
    const [favouriteArtists, setfavouriteArtists] = useState([]);

    const navigate = useNavigate()

    // Get user's favourite artists and albums.
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    
        // Fetch artists data when the component mounts

        //asking for the data from the artists collection from the database
        axios.get("http://localhost:4000/user/get-favourite-artists")
        .then(response=>{
            setfavouriteArtists(response.data);
            setIsLoading(false);
        })
        .catch(error=>{
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://localhost:4000/token/refresh-token")
            .then(response => {       
                localStorage.setItem('accessToken', response.data.accessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
                

                axios.get("http://localhost:4000/user/get-favourite-artists")
                .then(response=>{
                    setfavouriteArtists(response.data);
                    setIsLoading(false);
                })
            })
            .catch(error => {
                navigate("/", { replace: true })
            })
        })

        //asking for the data from the albums collection from the database
        axios.get("http://localhost:4000/user/get-favourite-albums")
        .then(response=>{
            // Set the state with the albums
            setfavouriteAlbums(response.data);
        })
        .catch(error=>{
            const refreshToken = localStorage.getItem('refreshToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

            axios.get("http://localhost:4000/token/refresh-token")
            .then(response => {       
                localStorage.setItem('accessToken', response.data.accessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
                
                axios.get("http://localhost:4000/user/get-favourite-albums")
                .then(response=>{
                    // Set the state with the albums
                    setfavouriteAlbums(response.data);
                })
            })
            .catch(error => {
                navigate("/", { replace: true })
            })
        })
    }, []);

    const handleShowAllArtistsClick = () => {
        props.setChoice("All");
    };

    // Handle the click of the Artist
    const handleArtistClick = (artist) => {
        props.setSelectedArtist(artist);
            props.setChoice("ArtistsSongs");
    };

    // Handle the click of the Album
    const handleAlbumClick = (album) => {
        props.setSelectedAlbum(album);
            props.setChoice("AlbumSongs");
    };

    return(
        <div className=" flex-wrap overflow-y-auto h-full">
            <div className="text-white mb-4 text-center">
                <p className="font-bold">Find Your Favourite Songs</p>
                <p className="text-gray">Like you favourite music & find it here</p>
            </div>
            <div className="text-white mb-4 mt-8 ml-20 text-xl">
                <p className="font-bold">Your Favourite Artists:</p>
            </div>
                <div className="flex flex-row flex-wrap items-center text-white gap-4 overflow-x-auto ml-8 mt-8">
                {isLoading ? (
                        <div className="flex justify-center items-center w-full h-full">
                            <ClipLoader color="purple" size={150} /> {/* Spinner component */}
                        </div>
                    ) : favouriteArtists.length > 0 ? (
                        favouriteArtists.map((artist, index) => (
                        <div key={index} className="text-white" onClick={() => handleArtistClick(artist)}>
                            <Artists 
                                image = {artist.image}
                                name = {artist.name}
                                music = {artist.style}

                            />
                        </div>
                    ))
                    ) : (
                        <p>No artists found</p>
                    )}
            </div>
            <div className="flex flex-row justify-between text-white mb-4 mt-12 ml-20 text-xl">
                <p className="font-bold">Your Favourite Albums:</p>
                <p className="mr-20 text-lg text-slate-300">
                    <a
                        href="#"
                        className="hover:text-white hover:underline"
                        onClick={handleShowAllArtistsClick} // Attach the click handler to the "Show all" link
                    >
                    Show more
                    </a>
                </p>
            </div>
            <div className="flex flex-row flex-wrap items-center text-white gap-4 overflow-x-auto ml-8 mt-8 mb-16">
            {isLoading ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <ClipLoader color="purple" size={150} /> {/* Spinner component */}
                    </div>
                ) : favouriteAlbums.length > 0 ? (
                    favouriteAlbums.map((album,index) => (
                    <div key={index} className="" onClick={() => handleAlbumClick(album)}>
                        <Albums 
                            image = {album.image}
                            artist = {album.artist}
                            name = {album.name}
                            genre ={album.style}
                            year = {album.year}
                        />
                    </div>
                ))
                ) : (
                    <p>No albums found</p>
                )}
            </div>
        </div>
    )
}

export default Favorites;