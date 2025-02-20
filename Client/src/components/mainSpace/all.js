// Basic imports.
import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import axios for requests.
import axios from "axios";

// React spinner.
import { ClipLoader } from 'react-spinners' 

// Component imports.
import Songs from '../albumComponent/song';
import Artists from '../artistsComponent/artistsComponent';
import Albums from '../albumComponent/albumComponent'

function All(props) {
    const [isLoading, setIsLoading] = useState(true); 
    const [AllRecentSongs, setAllRecentSongs] = useState([]);
    const [allArtists, setAllArtists] = useState([]);
    const [allAlbums,setAllAlbums] = useState([]);

    const navigate = useNavigate()
    
    // Get all artists' data request.
    useEffect(() => {
            let accessToken = localStorage.getItem('accessToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        
            // Fetch artists data when the component mounts

            //asking for the data from the artists collection from the database
            axios.get("http://localhost:4000/artists/get-all-artists")
            .then(response=>{
                const allArtists = response.data;
                // Shuffle the array
                const shuffledArtists = allArtists.sort(() => 0.5 - Math.random());
                // Get the first 4 albums
                const randomArtists = shuffledArtists.slice(0, 4);
                // Set the state with the 4 random artists
                setAllArtists(randomArtists);
                setIsLoading(false);
            })
            .catch(error=>{
                const refreshToken = localStorage.getItem('refreshToken');
                axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

                axios.get("http://localhost:4000/token/refresh-token")
                .then(response => {       
                    localStorage.setItem('accessToken', response.data.accessToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
                    
                axios.get("http://localhost:4000/artists/get-all-artists")
                .then(response=>{
                    const allArtists = response.data;
                    // Shuffle the array
                    const shuffledArtists = allArtists.sort(() => 0.5 - Math.random());
                    // Get the first 4 albums
                    const randomArtists = shuffledArtists.slice(0, 4);
                    // Set the state with the 4 random artists
                    setAllAlbums(randomArtists);
                })   
                })
                .catch(error => {
                    navigate("/", { replace: true })
                })
            })

            accessToken = localStorage.getItem('accessToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

            //asking for the data from the albums collection from the database
            axios.get("http://localhost:4000/albums/get-all-albums")
            .then(response=>{
                const allAlbums = response.data;
                // Shuffle the array
                const shuffledAlbums = allAlbums.sort(() => 0.5 - Math.random());
                // Get the first 4 albums
                const randomAlbums = shuffledAlbums.slice(0, 4);
                // Set the state with the 4 random albums
                setAllAlbums(randomAlbums);
                setIsLoading(false);
            })
            .catch(error=>{
                const refreshToken = localStorage.getItem('refreshToken');
                axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

                axios.get("http://localhost:4000/token/refresh-token")
                .then(response => {       
                    localStorage.setItem('accessToken', response.data.accessToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
                    
                axios.get("http://localhost:4000/albums/get-all-albums")
                .then(response=>{
                    const allAlbums = response.data;
                    // Shuffle the array
                    const shuffledAlbums = allAlbums.sort(() => 0.5 - Math.random());
                    // Get the first 4 albums
                    const randomAlbums = shuffledAlbums.slice(0, 4);
                    // Set the state with the 4 random albums
                    setAllAlbums(randomAlbums);
                })   
                })
                .catch(error => {
                    navigate("/", { replace: true })
                })
            })

            accessToken = localStorage.getItem('accessToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
            
            axios.get("http://localhost:4000/user/get-recent-songs")
            .then(response=>{
                setAllRecentSongs(response.data.songs); //assuming the response contains an array of data
                
                setIsLoading(false);
            })
            .catch(error=>{
                const refreshToken = localStorage.getItem('refreshToken');
                axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`

                axios.get("http://localhost:4000/token/refresh-token")
                .then(response => {       
                    localStorage.setItem('accessToken', response.data.accessToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`
                    
                    axios.get("http://localhost:4000/user/get-recent-songs")
                    .then(response=>{
                        setAllRecentSongs(response.data.songs); //assuming the response contains an array of data
                        
                        setIsLoading(false);
                    })
                })
                .catch(error => {
                    navigate("/", { replace: true })
                })
            })   
    }, [])

    // Go to all artists' page.
    const handleShowAllArtistsClick = () => {
         props.setChoice("Artists");
    };

    // Go to all albums' page.
    const handleShowAllAlbumsClick = () => {
        props.setChoice("Albums");
    };

    // Go to a specific artist's page.
    const handleArtistClick = (artist) => {
        props.setSelectedArtist(artist);
         props.setChoice("ArtistsSongs");
    };

    // Go to a specific album's page.
    const handleAlbumClick = (album) => {
        props.setSelectedAlbum(album);
         props.setChoice("AlbumSongs");
    };

    return (
        <div className=" flex-wrap overflow-y-auto h-full">
            <div className="text-white mb-4 mt-8 ml-14 text-xl">
                <p className="font-bold">Recently Played</p>
            </div>
            <div className="flex flex-row flex-wrap text-white gap-5 overflow-x-auto ml-10 mt-8">
                {AllRecentSongs.map((song, index) => (
                    <div key={index} className="text-white">
                        <Songs 
                            image = {song.image}
                            name = {song.title}
                            artist = {song.artist}
                        />
                    </div>
                ))}
            </div>
            <div className="flex flex-row justify-between mb-4 mt-16 ml-14">
                <p className="font-bold text-white text-xl">Famous Artists</p>
                <p className="mr-20 text-lg text-slate-300">
                    <a
                        href="#"
                        className="hover:text-white hover:underline"
                        onClick={handleShowAllArtistsClick} // Attach the click handler to the "Show all" link
                    >
                    Show all
                    </a>
                </p>
            </div>
            <div></div>
            <div className="flex flex-row flex-wrap text-white gap-4 overflow-x-auto ml-10 mt-8" >
            {isLoading ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <ClipLoader color="purple" size={150} /> {/* Spinner component */}
                    </div>
                ) : allArtists.length > 0 ? (
                    allArtists.map((artist, index) => (
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
            <div className="flex flex-row justify-between mb-4 mt-16 ml-14">
                <p className="font-bold text-white text-xl">Top Tier Albums</p>
                <p className="mr-20 text-lg text-slate-300">
                    <a href="#" className="hover:text-white hover:underline"
                       onClick={handleShowAllAlbumsClick}>
                        Show all
                    </a>
                </p>
            </div>
            <div className="flex flex-row flex-wrap text-white gap-4 overflow-x-auto mb-14 ml-10 mt-8" >
            {isLoading ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <ClipLoader color="purple" size={150} /> {/* Spinner component */}
                    </div>
                ) : allAlbums.length > 0 ? (
                    allAlbums.map((album,index) => (
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
    );
}

export default All;